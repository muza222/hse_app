import { Injectable } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { TemplateExtended } from "@core/backend/dictionary/template/template-extended.interface";
import { TemplateSubsectionField } from "@core/backend/dictionary/template/template-subsection-field.interface";
import { AccessType } from "@core/backend/dictionary/template/access-type.enum";
import { FieldType } from "@core/backend/dictionary/template/field-type.enum";
import { TemplateSubsectionFieldExtended } from "@core/backend/dictionary/template/template-subsection-field-extended.interface";
import { DateTime, Interval } from "luxon";

import {
    cloneDeep as _cloneDeep,
    find as _find,
    findIndex as _findIndex,
    get as _get,
    isObject as _isObject,
} from "lodash/fp";
import { DisplayCondition } from "@core/backend/dictionary/template/display-condition.interface";
import { SessionStoreService } from "@core/session-store/session-store.service";
import parseValueToTyped from "@tools/parseValueToTyped";
import { TemplateSubSectionExtended } from "@core/backend/dictionary/template/template-subsection-extended.interface";
import { EppData } from "@core/backend/epp-data.interface";
import { ReferenceType } from "@core/backend/dictionary/template/reference-type.enum";
import { FacultyService } from "@core/backend/dictionary/faculty/faculty.service";
import { CourseService } from "@core/backend/dictionary/course/course.service";
import { ProgramService } from "@core/backend/dictionary/program/program.service";
import { FileStorageService } from "@core/backend/file-storage.service";
import { Subscription } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class FormService {
    private enumFieldCodes = [];
    private referencesFieldCodes = [];
    private form: FormGroup;
    private subscriptionList: Subscription[] = [];

    constructor(
        private fb: FormBuilder,
        private sessionStore: SessionStoreService,
        private facultyService: FacultyService,
        private courseService: CourseService,
        private programService: ProgramService,
        private fileStorageService: FileStorageService
    ) {}

    createForm(template: TemplateExtended) {
        this.form = this.fb.group({});

        template.sections.forEach((s) => {
            const sectionForm = this.fb.group({});
            this.form.addControl(s.code, sectionForm);

            s.subsections.forEach((ss) => {
                ss.showTitle = true;
                ss.showFields = true;
                if (ss.isMulti) {
                    ss.code += "_0";
                    ss.showFields = false;
                    ss.showButton = true;
                }
                ss.parent = s;
                const subSectionForm = this.fb.group({});
                sectionForm.addControl(ss.code, subSectionForm);

                ss.fields.forEach((f: TemplateSubsectionFieldExtended) => {
                    if (ss.isMulti) {
                        f.code += "_0";
                    }

                    f.parent = ss;
                    // По дефолту все поля надо показывать, кроме с аксесс deny. Позже отключим те, которые не надо
                    f.needShow = !(f.access === AccessType.DENY || f.type === FieldType.HIDDEN);

                    switch (f.type) {
                        case FieldType.ENUM:
                            this.enumFieldCodes.push(f.code);
                            break;
                        case FieldType.REFERENCE:
                            this.referencesFieldCodes.push(f.code);
                            break;
                    }

                    subSectionForm.addControl(f.code, this.createFieldControl(f));
                });
            });
        });

        this.setDisplayConditions(template);

        return this.form;
    }

    createFieldControl(field: TemplateSubsectionField): FormControl {
        let formControl;

        switch (field.type) {
            case FieldType.INPUT:
            case FieldType.TEXTAREA:
            case FieldType.ENUM:
            case FieldType.REFERENCE:
            case FieldType.FILE:
                formControl = new FormControl("");
                break;
            case FieldType.BOOLEAN:
                formControl = new FormControl(false);
                break;
            case FieldType.DATE:
                formControl = new FormControl("");
                break;
            default:
                formControl = new FormControl("");
        }

        if (field.code === "epp_status") {
            formControl.setValue("DRAFT");
        }

        if (field.access === AccessType.VIEW) {
            formControl.disable();
        }

        if (field.isRequired) {
            formControl.addValidators(Validators.required);
        }

        if (field.validationRegexp) {
            formControl.addValidators(Validators.pattern(new RegExp(field.validationRegexp)));
        }

        return formControl;
    }

    /**
     * Вытащить поля из формы и сложить их в мапу
     */
    extractFields(template: TemplateExtended, form: FormGroup): Record<string, string> {
        const map: Record<string, string> = {};

        for (const [, sectionValue] of Object.entries(form.getRawValue())) {
            if (_isObject(sectionValue)) {
                for (const [, subSectionValue] of Object.entries(sectionValue)) {
                    if (_isObject(subSectionValue)) {
                        for (const [fieldKey, fieldValue] of Object.entries(subSectionValue)) {
                            if (fieldValue && this.enumFieldCodes.includes(fieldKey)) {
                                map[fieldKey] = this.getEnumValues(template, fieldKey, fieldValue);
                            } else if (fieldValue && this.referencesFieldCodes.includes(fieldKey)) {
                                map[fieldKey] = this.getReferenceValues(template, fieldKey, fieldValue);
                            } else {
                                if (typeof fieldValue === "boolean" || typeof fieldValue === "number") {
                                    map[fieldKey] = fieldValue.toString();
                                } else {
                                    map[fieldKey] = fieldValue;
                                }
                            }
                        }
                    }
                }
            }
        }

        return map;
    }

    updateForm(template: TemplateExtended, epp: EppData) {
        for (const key of Object.keys(epp.data)) {
            if (!epp.data[key]) {
                continue;
            }

            const formControl = this.findFormControlByName(key);
            const templateField: TemplateSubsectionFieldExtended = this.findTemplateFieldByCode(
                template,
                key
            );

            if (!formControl) {
                console.error(`Didn't find form control ${key} when update form`);
                continue;
            }

            switch (templateField.type) {
                case FieldType.INPUT:
                case FieldType.TEXTAREA:
                case FieldType.DATE:
                case FieldType.HIDDEN:
                    formControl.setValue(epp.data[key]);
                    break;
                case FieldType.ENUM:
                    const parsedValue = JSON.parse(epp.data[key]);
                    const selectedField = templateField.enumCollection.find((ec) => {
                        return ec.name === parsedValue[0];
                    });

                    console.log(templateField.enumCollection, parsedValue);

                    if (selectedField) {
                        formControl.setValue(String(selectedField.id));
                    }
                    break;
                case FieldType.BOOLEAN:
                    formControl.setValue(parseValueToTyped(epp.data[key]));
                    break;
                case FieldType.FILE:
                    formControl.setValue(epp.data[key]);
                    this.loadFileName(templateField, epp.data[key]);
                    break;
                case FieldType.REFERENCE:
                    const parsedRefValue: any[] = JSON.parse(epp.data[key]);
                    const selectedIds = parsedRefValue.map((val) => {
                        return val.id;
                    });

                    if (templateField.isLazyCollection) {
                        templateField.referenceCollection = parsedRefValue;
                    }

                    formControl.setValue(selectedIds.join(","));
                    break;
                default:
                    break;
            }
        }

        return this.form;
    }

    public findFormControlByName(name): FormControl {
        for (const sectionName of Object.keys(this.form.controls)) {
            const section = this.form.controls[sectionName] as FormGroup;

            for (const subSectionName of Object.keys(section.controls)) {
                const subSection = section.controls[subSectionName] as FormGroup;

                for (const fieldName of Object.keys(subSection.controls)) {
                    if (fieldName === name) {
                        return subSection.controls[fieldName] as FormControl;
                    }
                }
            }
        }

        console.error(`Didn't find formControl with name: ${name}`);
        return null;
    }

    addSubSection(template: TemplateExtended, subSectionTemplate: TemplateSubSectionExtended, i = 0) {
        let insertCompleted = false;
        let newSubSectionTemplate: TemplateSubSectionExtended;
        const newSubSectionGroup: FormGroup = new FormGroup<any>({});
        let newPostfix;

        template.sections.forEach((s) => {
            if (insertCompleted) {
                return;
            }

            const subSectionIdx = _findIndex({ code: subSectionTemplate.code })(s.subsections);

            if (subSectionIdx > -1) {
                insertCompleted = true;
                [newSubSectionTemplate, newPostfix] = this.iterateSubSectionPostfix(subSectionTemplate, i);
                s.subsections.splice(subSectionIdx + 1 + i, 0, newSubSectionTemplate);
            }
        });

        newSubSectionTemplate.fields.forEach((f: TemplateSubsectionFieldExtended) => {
            f.parent = newSubSectionTemplate;
            // По дефолту все поля надо показывать, кроме с аксесс deny. Позже отключим те, которые не надо
            f.needShow = !(f.access === AccessType.DENY || f.type === FieldType.HIDDEN);

            switch (f.type) {
                case FieldType.ENUM:
                    this.enumFieldCodes.push(f.code);
                    break;
                case FieldType.REFERENCE:
                    this.referencesFieldCodes.push(f.code);
                    break;
            }

            newSubSectionGroup.addControl(f.code, this.createFieldControl(f));
        });

        if (subSectionTemplate.showButton === true) {
            subSectionTemplate.showButton = false;
            newSubSectionTemplate.showTitle = false;
            newSubSectionTemplate.showButton = true;
        }

        const parentFormGroup = this.form.controls[newSubSectionTemplate.parent.code] as FormGroup;
        parentFormGroup.addControl(newSubSectionTemplate.code, newSubSectionGroup);
        this.fixSubSectionFlags(template);
        this.setDisplayConditions(template);
    }

    fixSubSectionFlags(template: TemplateExtended) {
        template.sections.forEach((s) => {
            for (let i = 0; i < s.subsections.length; i++) {
                if (s.subsections[i].isMulti) {
                    s.subsections[i].showFields = true;
                    if (s.subsections[i + 1] && s.subsections[i].id === s.subsections[i + 1].id) {
                        s.subsections[i].showTitle = true;
                    }
                    if (s.subsections[i - 1] && s.subsections[i].id === s.subsections[i - 1].id) {
                        s.subsections[i].showTitle = false;
                        s.subsections[i - 1].showButton = false;
                        s.subsections[i].showButton = true;
                    }
                }
            }
        });
    }

    removeSubSection(template: TemplateExtended, subSection: TemplateSubSectionExtended) {
        const parentFormGroup = this.form.controls[subSection.parent.code] as FormGroup;
        template.sections.forEach((s) => {
            const subSectionIdx = _findIndex({ code: subSection.code })(s.subsections);
            if (s.subsections.includes(subSection)) {
                // todo прикрутить человеческое удаление, а не циклы за циклом
                const subSectionArr = [];
                s.subsections.forEach((subsection) => {
                    if (subsection.id === subSection.id) {
                        subSectionArr.push(subsection);
                    }
                });
                if (subSectionArr.length === 1) {
                    subSection.showButton = true;
                    subSection.showFields = false;
                } else {
                    s.subsections.splice(subSectionIdx, 1);
                    parentFormGroup.removeControl(subSection.code);
                    const subSectionArrNew = [];
                    s.subsections.forEach((subsection) => {
                        if (subsection.id === subSection.id) {
                            subSectionArrNew.push(subsection);
                        }
                    });
                    subSectionArrNew.forEach((ss, i) => {
                        i === 0 ? (ss.showTitle = true) : (ss.showTitle = false);
                        i === subSectionArrNew.length - 1 ? (ss.showButton = true) : (ss.showButton = false);
                    });
                }
            }
        });
    }

    iterateSubSectionPostfix(
        subSection: TemplateSubSectionExtended,
        i
    ): [TemplateSubSectionExtended, number] {
        const newSubSection = _cloneDeep(subSection);
        const splitedCode = newSubSection.code.split("_");
        const newIdx = Number(splitedCode[splitedCode.length - 1]) + 1 + i;
        splitedCode[splitedCode.length - 1] = newIdx.toString();
        newSubSection.code = splitedCode.join("_");
        newSubSection.fields.forEach((f) => {
            const splitedFieldCode = f.code.split("_");
            splitedFieldCode[splitedFieldCode.length - 1] = newIdx.toString();
            f.code = splitedFieldCode.join("_");
        });

        return [newSubSection, newIdx];
    }

    unsubscribeAll() {
        this.subscriptionList.forEach((s) => {
            s.unsubscribe();
        });

        this.subscriptionList = [];
    }

    /**
     * Поля в мультисекциях имеют постфикс вида _N
     * В дисплей кондишинах поля приходят без постфиксов
     * Поэтому надо добывать постфикс, если он существует
     */
    public getFieldPostfix(field: TemplateSubsectionFieldExtended) {
        let postfix = "";

        if (field.parent.isMulti) {
            const codeSplitted = field.code.split("_");
            const fieldNumber = codeSplitted[codeSplitted.length - 1];
            postfix = `_${fieldNumber}`;
        }

        return postfix;
    }

    /**
     * Вытащить поля из формулы, на которые надо подписаться
     */
    private extractDependentFields(fieldString): string[] {
        return fieldString.split(/[*\/()\-]+/).filter((field) => {
            return field.startsWith("epp_");
        });
    }

    private loadFileName(templateField, value) {
        const parsedValue = JSON.parse(value);
        this.fileStorageService.getFileHead(parsedValue.url).then((res) => {
            templateField.fileName = res.headers.get("x-amz-meta-file-name");
        });
    }

    private setDisplayConditions(template: TemplateExtended) {
        for (const sectionName of Object.keys(this.form.controls)) {
            const section = this.form.controls[sectionName] as FormGroup;

            for (const subSectionName of Object.keys(section.controls)) {
                const subSection = section.controls[subSectionName] as FormGroup;

                for (const fieldName of Object.keys(subSection.controls)) {
                    const field = subSection.controls[fieldName] as FormControl;
                    const templateField = this.findTemplateFieldByCode(template, fieldName);

                    if (templateField.displayConditions && templateField.displayConditions.length > 0) {
                        templateField.displayConditions.forEach((cond) => {
                            this.setSingleCondition(template, field, templateField, cond);
                        });
                    }
                }
            }
        }
    }

    private setSingleCondition(
        template: TemplateExtended,
        field: FormControl,
        templateField: TemplateSubsectionFieldExtended,
        condition: DisplayCondition
    ) {
        switch (condition.type) {
            case "visibility":
                switch (condition.rule) {
                    case "equals":
                        this.applyVisibilityEqualsRule(template, templateField, condition);
                        break;
                    case "over":
                        this.applyVisibilityOverRule(field, templateField, condition);
                        break;
                    default:
                        console.error(
                            `Need implement display condition with type ${condition.type} and rule ${condition.rule}`
                        );
                        break;
                }
                break;
            case "setter":
                switch (condition.rule) {
                    case "onchange":
                        this.applySetterOnChange(template, field, templateField, condition);
                        break;
                    case "ondisable":
                        this.applySetterOnDisable(field, templateField, condition);
                        break;
                    case "session":
                        this.applySetterSessionRule(field, condition);
                        break;
                    default:
                        console.error(
                            `Need implement display condition with type ${condition.type} and rule ${condition.rule}`
                        );
                        break;
                }
                break;
            case "limiter":
                switch (condition.rule) {
                    case "onchange":
                        this.applyLimiterOnChange(field, templateField, condition);
                        break;
                    case "systemtime":
                        this.applyLimiterSystemTime(templateField, condition);
                        break;
                    default:
                        console.error(
                            `Need implement display condition with type ${condition.type} and rule ${condition.rule}`
                        );
                        break;
                }
                break;
            case "filter":
                switch (condition.rule) {
                    case "onchange":
                        this.applyFilterOnChange(templateField, condition);
                        break;
                    default:
                        console.error(
                            `Need implement display condition with type ${condition.type} and rule ${condition.rule}`
                        );
                        break;
                }
                break;
            case "formula":
                this.applyFormula(template, field, condition);
                break;
            default:
                console.error("Need implement display condition with type ", condition.type);
                break;
        }
    }

    /**
     * Применить кондишн на отключение поля
     */
    private applySetterOnDisable(
        field: FormControl,
        templateField: TemplateSubsectionFieldExtended,
        condition: DisplayCondition
    ) {
        field.registerOnDisabledChange((val) => {
            if (val) {
                const valueForSet = condition.value;
                // TODO исправить на бэке кейс слов
                // const enumElement = _find()(templateField.enumCollection)

                const enumElement = _find((el: any) => {
                    return el.name.toLowerCase() === valueForSet.toLowerCase();
                })(templateField.enumCollection);

                if (enumElement) {
                    field.setValue(enumElement.id.toString());
                } else {
                    console.error(
                        `Not found element for condition with type ${condition.type} and rule ${condition.rule} and value ${condition.value}`
                    );
                }
            }
        });
    }

    /**
     * Применить кондишн для заполнения полей из выбранного поля из справочника
     */
    private applySetterOnChange(
        template: TemplateExtended,
        field: FormControl,
        templateField: TemplateSubsectionFieldExtended,
        condition: DisplayCondition
    ) {
        const postfix = this.getFieldPostfix(templateField);

        const managedForm = this.findFormControlByName(`${condition.field}${postfix}`);
        const managedTemplateField = this.findTemplateFieldByCode(template, `${condition.field}${postfix}`);

        const s = managedForm.valueChanges.subscribe((val) => {
            const referenceField = _find({ id: Number(val) })(managedTemplateField.referenceCollection);
            field.setValue(this.getLocalizedValue(condition.value, referenceField));
        });

        this.subscriptionList.push(s);
    }

    /**
     * Применить кондишн для сокрытия / показа поля в зависимости от значения другого поля
     */
    private applyVisibilityEqualsRule(
        template: TemplateExtended,
        templateField: TemplateSubsectionFieldExtended,
        condition: DisplayCondition
    ) {
        if (condition.action === "show") {
            if (condition.field === "role") {
                const userRole = this.sessionStore.getSession().activeRole.name;
                // В сессии роли лежат с префиксом EPP_, а в кондишене без
                const normalizedUserRole = userRole.slice(4);

                templateField.needShow = condition.value === normalizedUserRole;
            } else {
                const postfix = this.getFieldPostfix(templateField);

                const managedForm = this.findFormControlByName(`${condition.field}${postfix}`);
                const conditionVal = parseValueToTyped(condition.value);
                const managedFormInitialValue = managedForm.value;

                const s = managedForm.valueChanges.subscribe((val) => {
                    // булевы поля сравниваем в лоб
                    if (typeof conditionVal === "boolean") {
                        templateField.needShow = val === conditionVal;

                        if (templateField.access === AccessType.DENY) {
                            templateField.needShow = false;
                        }
                    } else {
                        // для других полей нам надо вычленять значения из енам/референс-коллекций
                        const managedTemplateField = this.findTemplateFieldByCode(template, condition.field);

                        if (
                            managedTemplateField.enumCollection &&
                            managedTemplateField.enumCollection.length > 0
                        ) {
                            const enumField = managedTemplateField.enumCollection.find(
                                (item) => item.id === Number(val)
                            );

                            if (!enumField) {
                                templateField.needShow = false;
                            } else {
                                console.log("enumField ", enumField);

                                console.log("conditionVal ", conditionVal);
                                console.log(val);
                                console.log(templateField);
                                console.log(condition);
                                // debugger

                                // TODO ни фига не работает
                                // templateField.needShow = enumField ? enumField.name === val : false;

                                // console.log('enumField ', enumField)
                                //
                                // console.log('conditionVal ', conditionVal)
                                // console.log(val);
                                // console.log(templateField);
                                // console.log(condition);
                                // console.error(`Need handle not boolean value ${conditionVal} in ${condition.type}
                                // and rule ${condition.rule} and action ${condition.action}`)
                            }
                        } else {
                            console.log("azaza");
                        }
                    }
                });

                managedForm.setValue(managedFormInitialValue);
                this.subscriptionList.push(s);
            }
        } else if (condition.action === "hide") {
            const managedForm = this.findFormControlByName(condition.field);
            const conditionVal = parseValueToTyped(condition.value);
            const managedFormInitialValue = managedForm.value;
            managedForm.setValue(managedFormInitialValue);

            const s = managedForm.valueChanges.subscribe((val) => {
                // булевы поля сравниваем в лоб
                if (typeof conditionVal === "boolean") {
                    templateField.needShow = val !== conditionVal;

                    if (templateField.access === AccessType.DENY) {
                        templateField.needShow = false;
                    }
                } else {
                    // для других полей нам надо вычленять значения из енам/референс-коллекций
                    console.error(
                        `Need implement condition with type ${condition.type}, rule ${condition.rule}, action ${condition.action}, conditionVal = ${conditionVal}`
                    );
                }
            });

            this.subscriptionList.push(s);
        } else {
            console.error(
                `Need implement condition with type ${condition.type} and rule ${condition.rule} and action ${condition.action}`
            );
        }
    }

    /**
     * Применить кондишн для заполнения полей данными из сессии
     */
    private applySetterSessionRule(field: FormControl, condition: DisplayCondition) {
        const session = this.sessionStore.getSession();

        if (condition.value === "fio") {
            field.setValue(this.sessionStore.getRuFio());
        } else if (condition.value === "role") {
            field.setValue(session.activeRole.name);
        } else {
            console.error(`Need implement session setter with type ${condition.value}`);
        }
    }

    /**
     * Применить кондишн на disable / enable поля при изменении значения ДРУГОГО поля
     */
    private applyVisibilityOverRule(
        field: FormControl,
        templateField: TemplateSubsectionFieldExtended,
        condition: DisplayCondition
    ) {
        const postfix = this.getFieldPostfix(templateField);
        const managedForm = this.findFormControlByName(`${condition.field}${postfix}`);

        const s = managedForm.valueChanges.subscribe((val) => {
            if (val > Number(condition.value)) {
                if (condition.action === "disabled") {
                    field.disable();
                } else {
                    console.error(
                        `Need implement condition with type ${condition.type} and rule ${condition.rule} and action ${condition.action}`
                    );
                }
            } else {
                field.enable();
            }
        });

        this.subscriptionList.push(s);
    }

    /**
     * Применить кондишн на ограничения (например дат)
     */
    private applyLimiterOnChange(
        field: FormControl,
        templateField: TemplateSubsectionFieldExtended,
        condition: DisplayCondition
    ) {
        const managedForm = this.findFormControlByName(condition.field);

        const s = managedForm.valueChanges.subscribe((val) => {
            if (condition.action === "min") {
                if (val) {
                    templateField.minDate = val;

                    if (field.value && val > field.value) {
                        field.setValue("");
                    }
                }
            } else {
                console.error(
                    `Need implement condition with type ${condition.type} and rule ${condition.rule} and action ${condition.action}`
                );
            }
        });

        this.subscriptionList.push(s);
    }

    /**
     * Применить кондишн на выставление текущей даты
     */
    private applyLimiterSystemTime(
        templateField: TemplateSubsectionFieldExtended,
        condition: DisplayCondition
    ) {
        if (condition.action === "min") {
            const now = DateTime.local();
            templateField.minDate = now.toISO();
        } else {
            console.error(`Need implement limiter system time with action ${condition.action}`);
        }
    }

    /**
     * Применить кондишн на фильтрацию значений при изменении другого поля
     */
    private applyFilterOnChange(templateField: TemplateSubsectionFieldExtended, condition: DisplayCondition) {
        const postfix = this.getFieldPostfix(templateField);
        const managedForm = this.findFormControlByName(`${condition.field}${postfix}`);

        const s = managedForm.valueChanges.subscribe(async (val) => {
            if (val) {
                // const params = {
                //   [condition.action]: val
                // };
                const params = {
                    filter: val,
                };
                templateField.referenceCollection = await this.loadReferenceCollection(
                    templateField.reference,
                    params
                );
            } else {
                templateField.referenceCollection = [];
            }
        });

        this.subscriptionList.push(s);
    }

    private async loadReferenceCollection(type: ReferenceType, params) {
        let promise;
        switch (type) {
            case ReferenceType.FACULTY:
                promise = this.facultyService.getList(params);
                break;
            case ReferenceType.COURSE:
                promise = this.courseService.getList(params);
                break;
            case ReferenceType.LEARN_PROGRAM:
                promise = this.programService.getList(params);
                break;
            default:
                promise = new Promise((resolve) => {
                    resolve([]);
                });
                console.error(`Need implement reference for ${type}`);
        }

        return promise;
    }

    /**
     * Применить кондишн на подсчёт значения с помощью формулы
     */
    private applyFormula(template: TemplateExtended, field: FormControl, condition: DisplayCondition) {
        const dependentFieldsName = this.extractDependentFields(condition.value);

        switch (condition.field) {
            case "sumWithMulti":
                const positionNumFormControls = this.filterFormControlByName("epp_vacancy_position_num");
                const vacancyCreditFormControls = this.filterFormControlByName("epp_vacancy_credit");
                const allFormControls = positionNumFormControls.concat(vacancyCreditFormControls);

                allFormControls.forEach((fc) => {
                    const s = fc.valueChanges.subscribe(() => {
                        this.calcSumWithMulti(template);
                    });

                    this.subscriptionList.push(s);
                });
                break;
            case "sum": // sum(epp_vacancy_position_num)
                dependentFieldsName.forEach((df) => {
                    const managedForms = this.filterFormControlByName(df);

                    managedForms.forEach((mf) => {
                        const s = mf.valueChanges.subscribe(() => {
                            field.setValue(this.sumPositionNum(df));
                        });

                        this.subscriptionList.push(s);
                    });
                });

                break;
            case "calcIntensity": // epp_vacancy_credit*25/round((epp_finish_date-epp_start_date)/7)
                const eppFinishDateFormControl = this.findFormControlByName("epp_finish_date");
                const eppStartDateFormControl = this.findFormControlByName("epp_start_date");
                const vacancyCreditForms = this.filterFormControlByName("epp_vacancy_credit");

                const finishSubscription = eppFinishDateFormControl.valueChanges.subscribe((val) => {
                    this.calcIntensity(template, eppStartDateFormControl.value, val);
                });
                this.subscriptionList.push(finishSubscription);

                const startDescription = eppStartDateFormControl.valueChanges.subscribe((val) => {
                    this.calcIntensity(template, val, eppFinishDateFormControl.value);
                });
                this.subscriptionList.push(startDescription);

                vacancyCreditForms.forEach((mf) => {
                    const s = mf.valueChanges.subscribe(() => {
                        this.calcIntensity(
                            template,
                            eppStartDateFormControl.value,
                            eppFinishDateFormControl.value
                        );
                    });
                    this.subscriptionList.push(s);
                });

                break;
            default:
                console.error(`Need implement formula with field ${condition.field}`);
                break;
        }
    }

    /**
     * Высчитать общее количество кредитов
     * sum(epp_vacancy_position_num*epp_vacancy_credit)
     */
    private calcSumWithMulti(template: TemplateExtended) {
        let sum = 0;
        const vacancyTemplateFields = this.filterTemplateFieldByCode(template, "epp_vacancy_position_num");

        const postfixes = [];
        vacancyTemplateFields.forEach((f) => {
            postfixes.push(this.getFieldPostfix(f));
        });

        postfixes.forEach((postfix) => {
            const positionFormControl = this.findFormControlByName(`epp_vacancy_position_num${postfix}`);
            const creditFormControl = this.findFormControlByName(`epp_vacancy_credit${postfix}`);

            if (positionFormControl.value && creditFormControl.value) {
                sum += positionFormControl.value * creditFormControl.value;
            }
        });

        const totalCreditFormControl = this.findFormControlByName("epp_total_credit");
        totalCreditFormControl.setValue(sum);
    }

    /**
     * Вычислить интенсивность вакансии(й) (чтобы это не значило)
     * epp_vacancy_credit * 25 / round( (epp_finish_date - epp_start_date) / 7 )
     */
    private calcIntensity(template: TemplateExtended, startDate, finishDate, fieldCode?) {
        if (!startDate || !finishDate) {
            return null;
        }

        const interval = Interval.fromDateTimes(DateTime.fromISO(startDate), DateTime.fromISO(finishDate));
        const intervalInWeeks = Math.round(interval.length("weeks"));

        // let managedForms = [];
        // Если нет fieldCode, значит изменились даты и надо пересчитывать для всех полей epp_vacancy_credit_N
        if (!fieldCode) {
            const templateFields = this.filterTemplateFieldByCode(template, "epp_vacancy_credit");

            templateFields.forEach((tf) => {
                const creditFormControl = this.findFormControlByName(tf.code);
                const postfix = this.getFieldPostfix(tf);
                const intensityFormControl = this.findFormControlByName(`epp_vacancy_intensity${postfix}`);

                if (creditFormControl.value) {
                    intensityFormControl.setValue(
                        Math.round((creditFormControl.value * 25) / intervalInWeeks)
                    );
                } else {
                    intensityFormControl.setValue("");
                }
            });
        } else {
            // TODO Need implement, but laziness
        }
    }

    /**
     * Просуммировать значение полей, начинающиеся на fieldStart
     */
    private sumPositionNum(fieldStart) {
        const formControls = this.filterFormControlByName(`${fieldStart}_`);

        let sum = 0;

        formControls.forEach((fc: FormControl) => {
            const val = Number(fc.value);

            if (!Number.isNaN(val)) {
                sum += val;
            }
        });

        return sum;
    }

    private filterFormControlByName(name): FormControl[] {
        const filters = [];
        for (const sectionName of Object.keys(this.form.controls)) {
            const section = this.form.controls[sectionName] as FormGroup;

            for (const subSectionName of Object.keys(section.controls)) {
                const subSection = section.controls[subSectionName] as FormGroup;

                for (const fieldName of Object.keys(subSection.controls)) {
                    if (fieldName.startsWith(name)) {
                        filters.push(subSection.controls[fieldName] as FormControl);
                    }
                }
            }
        }

        return filters;
    }

    private filterTemplateFieldByCode(
        template: TemplateExtended,
        code: string
    ): TemplateSubsectionFieldExtended[] {
        const fields = [];

        for (const s of template.sections) {
            for (const ss of s.subsections) {
                for (const f of ss.fields) {
                    if (f.code.startsWith(`${code}_`)) {
                        fields.push(f);
                    }
                }
            }
        }

        return fields;
    }

    /**
     * Поля с типом ENUM сохраняются в виде сериализованного в стрингу массива вида
     * [\"русский\",\"english'\"]
     * В форме хранятся айдишники. Надо вычленить значения
     */
    private getEnumValues(template: TemplateExtended, fieldKey, fieldValue) {
        const fieldValuesAsArray = fieldValue.split(",").map(Number);
        const templateField = this.findTemplateFieldByCode(template, fieldKey);
        const templateFieldValues = [];

        templateField.enumCollection.forEach((el) => {
            if (fieldValuesAsArray.includes(el.id)) {
                templateFieldValues.push(el.name);
            }
        });

        return JSON.stringify(templateFieldValues);
    }

    /**
     * Поля с типом REFERENCE сохраняются в виде сериализованного в стрингу массива вида
     * "[{\"id\":1,\"name\":{\"ru\":\"ВШЭ\",\"en\":\"HSE\"}},{\"id\":5,\"name\":{\"ru\":\"новыйтэг\",\"en\":\"newtag\"}}]"
     * В форме хранятся айдишники. Надо вычленить значения
     */
    private getReferenceValues(template: TemplateExtended, fieldKey, fieldValue) {
        const fieldValuesAsArray = fieldValue.split(",").map(Number);
        const templateField = this.findTemplateFieldByCode(template, fieldKey);
        const templateFieldValues = [];

        templateField.referenceCollection.forEach((el) => {
            if (fieldValuesAsArray.includes(el.id)) {
                templateFieldValues.push(el);
            }
        });

        return JSON.stringify(templateFieldValues);
    }

    private findTemplateFieldByCode(
        template: TemplateExtended,
        code,
        isFuzzySearch = false
    ): TemplateSubsectionFieldExtended {
        let field = null;

        for (const s of template.sections) {
            for (const ss of s.subsections) {
                for (const f of ss.fields) {
                    if (isFuzzySearch) {
                        if (f.code.startsWith(`${code}_`)) {
                            field = f;
                            break;
                        }
                    } else {
                        if (f.code === code) {
                            field = f;
                            break;
                        }
                    }
                }
                if (field) {
                    break;
                }
            }
            if (field) {
                break;
            }
        }

        return field;
    }

    private getLocalizedValue(value, field) {
        const newValue: any = _get(value)(field);

        if (_isObject(newValue)) {
            return newValue["ru"];
        } else {
            return newValue;
        }
    }
}
