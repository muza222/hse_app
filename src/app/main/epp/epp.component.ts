import { Component, OnDestroy, OnInit } from "@angular/core";
import { FieldType } from "@core/backend/dictionary/template/field-type.enum";
import { TemplateService } from "@core/backend/dictionary/template/template.service";
import { SessionStoreService } from "@core/session-store/session-store.service";
import { EppStatus, UserType } from "@core/enums";
import { Location } from "@angular/common";

import { TemplateExtended } from "@core/backend/dictionary/template/template-extended.interface";
import { TemplateUtilsService } from "@core/template-utils/template-utils.service";
import { FormGroup } from "@angular/forms";
import { FormService } from "./form.service";
import { TemplateSubsectionFieldExtended } from "@core/backend/dictionary/template/template-subsection-field-extended.interface";
import { ReferenceType } from "@core/backend/dictionary/template/reference-type.enum";
import { EmployeeService } from "@core/backend/dictionary/employee/employee.service";
import { FileStorageService } from "@core/backend/file-storage.service";
import { EppService } from "@core/backend/handler/epp.service";
import { HseAlertService } from "@core/hse-alert/hse-alert.service";
import { TemplateSubSectionExtended } from "@core/backend/dictionary/template/template-subsection-extended.interface";
import { every as _every } from "lodash/fp";
import { ActivatedRoute, Router } from "@angular/router";
import { StorageService } from "@core/backend/storage.service";
import { EppData } from "@core/backend/epp-data.interface";
import { MyEppDeleteDialogComponent } from "@shared/my-epp-delete-dialog/my-epp-delete-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { FacultyService } from "@core/backend/dictionary/faculty/faculty.service";

@Component({
    selector: "app-epp",
    templateUrl: "./epp.component.html",
    styleUrls: ["./epp.component.scss"],
})
export class EppComponent implements OnInit, OnDestroy {
    public FieldType = FieldType;

    template: TemplateExtended;
    templateForm: FormGroup;
    savedEntity: Record<string, string>;
    epp: EppData;
    eppId;
    queryEppParams;
    isLeader;
    showLeadersButtons;
    isInvalidFormControls: boolean;
    itemArray: Array<string>;

    constructor(
        private templateService: TemplateService,
        private formService: FormService,
        public sessionStore: SessionStoreService,
        private templateUtilsService: TemplateUtilsService,
        private employeeService: EmployeeService,
        private facultyService: FacultyService,
        private fileStorageService: FileStorageService,
        private eppService: EppService,
        private alertService: HseAlertService,
        private location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private storageService: StorageService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.eppId = this.route.snapshot.paramMap.get("id");
        this.queryEppParams = this.route.snapshot.queryParamMap.get("role");
        this.itemArray = ["ФИО студента", "Дата рождения студента", "Факультет"];
        this.loadData();
    }

    async loadData() {
        if (this.eppId) {
            this.epp = await this.storageService.getEppById(this.eppId);
            // this.epp.data["epp_status"] = "READY_FOR_PUBLICATION";
            this.checkLeadersRoles();
            this.checkLeader();
        }

        const status = (this.epp?.data["epp_status"] as EppStatus) || EppStatus.DRAFT;
        let role = this.sessionStore.getSession()?.activeRole.name;

        if (this.queryEppParams === "EPP_EMPLOYEE" && role !== "STUDENT") {
            role = this.queryEppParams;
        }

        if (
            this.isLeader &&
            (status === EppStatus.REVIEW_MANAGER_EPP || status === EppStatus.READY_FOR_PUBLICATION)
        ) {
            //role = UserType.EPP_LEADER;
        }

        const template = await this.templateService.get(status, 1, role);
        this.template = await this.templateUtilsService.mapTemplate(template);
        this.templateForm = this.formService.createForm(this.template);

        if (this.eppId) {
            this.template = this.templateUtilsService.updateTemplate(this.template, this.epp);
            this.templateForm = this.formService.updateForm(this.template, this.epp);
        }
    }

    checkLeadersRoles() {
        const ids = [];
        if (this.epp?.data["epp_leader"]) {
            ids.push(JSON.parse(this.epp.data["epp_leader"])[0].personId);
        }
        if (this.epp?.data["epp_tech_leader"]) {
            ids.push(JSON.parse(this.epp.data["epp_tech_leader"])[0].personId);
        }
        if (ids.includes(this.sessionStore?.session?.id)) {
            this.showLeadersButtons = true;
        }
    }

    checkLeader() {
        if (
            this.epp?.data["epp_leader"] &&
            JSON.parse(this.epp?.data["epp_leader"])[0].personId === this.sessionStore.session?.id
        ) {
            this.isLeader = true;
        }
    }

    async deleteDraft(epp) {
        const formDialog$ = this.dialog
            .open<MyEppDeleteDialogComponent, any>(MyEppDeleteDialogComponent, {
                data: { epp },
                autoFocus: "first-heading",
            })
            .afterClosed();

        formDialog$.subscribe(async (id) => {
            if (id) {
                await this.eppService.deleteEpp(id);
                this.router.navigate(["my-epp"]);
            }
        });
    }

    async updateStatus(action) {
        if (this.templateForm.invalid) {
            this.isInvalidFormControls = true;
            this.templateForm.markAllAsTouched();
            this.alertService.error("Не все обязательные поля заявки были заполнены");
            return;
        }
        const mapForSave = this.formService.extractFields(this.template, this.templateForm);
        await this.eppService.update(mapForSave, this.eppId, action);
        this.alertService.success("Статус успешно обновлён");
        await this.loadData();
    }

    /**
     *
     */
    async loadLazyReference(field: TemplateSubsectionFieldExtended, searchValue) {
        switch (field.reference) {
            case ReferenceType.EMPLOYEE:
                field.referenceCollection = await this.employeeService.getList(searchValue);
                break;
            case ReferenceType.FACULTY:
                const postfix = this.formService.getFieldPostfix(field);
                const dependentFC = this.formService.findFormControlByName(`epp_allowable_filial${postfix}`);

                const params = {
                    name: searchValue,
                    filter: dependentFC.value,
                };

                field.referenceCollection = await this.facultyService.getList(params);
                break;
            default:
                console.error(`Need implement lazy loading for reference: ${field.reference}`);
        }
    }

    async save() {
        const mapForSave = this.formService.extractFields(this.template, this.templateForm);

        if (!this.eppId) {
            const res: any = await this.eppService.save(mapForSave);
            this.eppId = res.epp_id;
            this.location.replaceState(`/epp/${this.eppId}`);
            this.alertService.success("ЭПП успешно сохранён");
            this.loadData();
        } else {
            await this.eppService.update(mapForSave, this.eppId);
            this.alertService.success("ЭПП успешно обновлён");
        }
    }

    debug() {
        this.savedEntity = this.formService.extractFields(this.template, this.templateForm);
    }

    async fileUpload($event: any) {
        const res = await this.fileStorageService.uploadFile($event.file);
        this.formService.findFormControlByName($event.code).setValue(res);
    }

    async fileDelete($event: any) {
        const uuid = JSON.parse(this.formService.findFormControlByName($event).value).id;
        await this.fileStorageService.deleteFile(uuid);
        this.formService.findFormControlByName($event).setValue("");
    }

    allFieldsIsHidden(subSection: TemplateSubSectionExtended) {
        return _every({ needShow: false })(subSection.fields);
    }

    addSubSection(subSection: TemplateSubSectionExtended) {
        if (subSection.showFields === false) {
            subSection.showFields = true;
            return;
        }
        this.formService.addSubSection(this.template, subSection);
    }

    removeSubSection(subSection: TemplateSubSectionExtended) {
        this.formService.removeSubSection(this.template, subSection);
    }

    ngOnDestroy() {
        this.formService.unsubscribeAll();
    }
}
