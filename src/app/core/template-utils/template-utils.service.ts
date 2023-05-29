import { Injectable } from "@angular/core";
import { Template } from "@core/backend/dictionary/template/template.interface";
import { TemplateExtended } from "@core/backend/dictionary/template/template-extended.interface";
import { FieldType } from "@core/backend/dictionary/template/field-type.enum";
import _uniq from "lodash/uniq";
import { ReferenceType } from "@core/backend/dictionary/template/reference-type.enum";
import { TemplateSubsectionFieldExtended } from "@core/backend/dictionary/template/template-subsection-field-extended.interface";
import { HttpClient } from "@angular/common/http";
import { FilialService } from "@core/backend/dictionary/filial/filial.service";
import { FacultyService } from "@core/backend/dictionary/faculty/faculty.service";
import { DepartmentService } from "@core/backend/dictionary/department/department.service";
import { EmployeeService } from "@core/backend/dictionary/employee/employee.service";
import { StudentService } from "@core/backend/dictionary/student/student.service";
import { LevelService } from "@core/backend/dictionary/level/level.service";
import { CourseService } from "@core/backend/dictionary/course/course.service";
import { ProgramService } from "@core/backend/dictionary/program/program.service";
import { PrerequisiteService } from "@core/backend/dictionary/prerequisite/prerequisite.service";
import { TagService } from "@core/backend/dictionary/tag/tag.service";
import { DtService } from "@core/backend/dictionary/dt/dt.service";
import { FormService } from "../../main/epp/form.service";
import { cloneDeep as _cloneDeep, map as _map } from "lodash/fp";
import { EppData } from "@core/backend/epp-data.interface";
import { TemplateSubSectionExtended } from "@core/backend/dictionary/template/template-subsection-extended.interface";

@Injectable({
    providedIn: "root",
})
export class TemplateUtilsService {
    private readonly LAZY_REFERENCES = [
        ReferenceType.EMPLOYEE,
        ReferenceType.STUDENT,
        ReferenceType.FACULTY,
        ReferenceType.COURSE,
        ReferenceType.LEARN_PROGRAM,
    ];

    constructor(
        private http: HttpClient,
        private filialService: FilialService,
        private facultyService: FacultyService,
        private departmentService: DepartmentService,
        private employeeService: EmployeeService,
        private studentService: StudentService,
        private levelService: LevelService,
        private courseService: CourseService,
        private programService: ProgramService,
        private prerequisiteService: PrerequisiteService,
        private tagService: TagService,
        private dtService: DtService,
        private formService: FormService
    ) {}

    /**
     * Смапить шаблон
     */
    async mapTemplate(template: Template): Promise<TemplateExtended> {
        let newTemplate: TemplateExtended = template;
        let referencesName = [];

        newTemplate.sections.forEach((s) => {
            s.subsections.forEach((ss) => {
                ss.fields.forEach((f) => {
                    switch (f.type) {
                        case FieldType.ENUM:
                            f = this.createEnumCollection(f);
                            break;
                        case FieldType.REFERENCE:
                            if (
                                f.code === "epp_leader" ||
                                f.code === "epp_tech_leader" ||
                                f.code === "epp_int_coleader"
                            ) {
                                f.showDepartment = true;
                            }

                            if (!this.LAZY_REFERENCES.includes(f.reference)) {
                                referencesName.push(f.reference);
                            }
                            break;
                    }
                });
            });
        });

        referencesName = _uniq(referencesName);
        const referencesMap = new Map<ReferenceType, any[]>();

        if (referencesName.length > 0) {
            const references = await Promise.all(this.getReferences(referencesName));

            referencesName.forEach((rn, index) => {
                referencesMap.set(rn, references[index]);
            });
        }

        newTemplate = this.setReferencesToFields(newTemplate, referencesMap);

        return newTemplate;
    }

    /**
     * Обновить шаблон
     */
    updateTemplate(template: TemplateExtended, epp: EppData) {
        const newTemplate = _cloneDeep(template);

        template.sections.forEach((s) => {
            s.subsections.forEach((ss) => {
                if (ss.isMulti) {
                    const splitter = "_";
                    const code =
                        `${ss.fields[0].code}`.split(splitter).slice(0, -1).join(splitter) + `_[0-9]`;
                    const count = this.countMultiSection(epp, code);

                    for (let i = 0; i < count - 1; i++) {
                        this.formService.addSubSection(newTemplate, ss, i);
                    }

                    if (count === 1) {
                        const hasFilledValue = this.subSectionHasFilledValue(ss, epp);

                        if (hasFilledValue) {
                            this.setSubSectionFields(newTemplate, ss.code);
                        }
                    }
                }
            });
        });

        return newTemplate;
    }

    /**
     * Проставить флаги видимости кнопки / тайтла / поля для мульти сабсекций
     */
    private setSubSectionFields(template: TemplateExtended, code: string) {
        for (const s of template.sections) {
            for (const ss of s.subsections) {
                if (ss.code === code) {
                    ss.showTitle = true;
                    ss.showButton = true;
                    ss.showFields = true;

                    return;
                }
            }
        }
    }

    /**
     * Имеет ли подсекция заполненное поле
     */
    private subSectionHasFilledValue(subSection: TemplateSubSectionExtended, epp: EppData): boolean {
        const fieldCodes = _map("code")(subSection.fields);

        for (const code of fieldCodes) {
            const eppCodeValue = epp.data[code];

            if (eppCodeValue) {
                return true;
            }
        }

        return false;
    }

    /**
     * Посчитать количество мультисекций
     */
    private countMultiSection(epp: EppData, code): number {
        let count = 0;
        const reg = new RegExp(code);
        Object.keys(epp["data"]).forEach((el) => {
            if (reg.test(el)) {
                count += 1;
            }
        });

        return count;
    }

    /**
     * Создать коллекцию для мультиселекта из плоского массива
     */
    private createEnumCollection(f: TemplateSubsectionFieldExtended): TemplateSubsectionFieldExtended {
        const newF: TemplateSubsectionFieldExtended = f;

        newF.enumCollection = [];

        f.enumList.map((el, index) => {
            newF.enumCollection.push({
                id: index + 1,
                name: el,
            });
        });

        return newF;
    }

    /**
     * Получить справочники
     */
    private getReferences(referencesName: string[]): Promise<any[]>[] {
        const referencesPromise = [];

        referencesName.forEach((rn) => {
            let promise;
            switch (rn) {
                case ReferenceType.FILIAL:
                    promise = this.filialService.getList();
                    break;
                case ReferenceType.FACULTY:
                    promise = this.facultyService.getList();
                    break;
                case ReferenceType.DEPARTMENT:
                    promise = this.departmentService.getList();
                    break;
                case ReferenceType.EMPLOYEE:
                    promise = this.employeeService.getList();
                    break;
                case ReferenceType.STUDENT:
                    promise = this.studentService.getList();
                    break;
                case ReferenceType.EDU_LEVEL:
                    promise = this.levelService.getList();
                    break;
                case ReferenceType.COURSE:
                    promise = this.courseService.getList();
                    break;
                case ReferenceType.LEARN_PROGRAM:
                    promise = this.programService.getList();
                    break;
                case ReferenceType.PREREQUISITE:
                    promise = this.prerequisiteService.getList();
                    break;
                case ReferenceType.TAG:
                    promise = this.tagService.getList();
                    break;
                case ReferenceType.DT_USAGE_AREA:
                    promise = this.dtService.getUsageAreaList();
                    break;
                case ReferenceType.DT_PYTHON_LIBRARIES:
                    promise = this.dtService.getPythonLibList();
                    break;
                case ReferenceType.DT_METHODS:
                    promise = this.dtService.getMethodList();
                    break;
                case ReferenceType.DT_PROGRAM_LANGUAGES:
                    promise = this.dtService.getProgramLanguageList();
                    break;
                case ReferenceType.DT_PROGRAMS:
                    promise = this.dtService.getProgramList();
                    break;
                case ReferenceType.DT_DATA_TOOLS:
                    promise = this.dtService.getDataToolList();
                    break;
                default:
                    promise = new Promise((resolve, reject) => {
                        resolve([]);
                    });
                    console.error(`Need implement reference for ${rn}`);
            }

            referencesPromise.push(promise);
        });

        return referencesPromise;
    }

    /**
     * Проставить коллекции для филдов с типов REFERENCE
     */
    private setReferencesToFields(template: TemplateExtended, referencesMap: Map<ReferenceType, any[]>) {
        template.sections.forEach((s) => {
            s.subsections.forEach((ss) => {
                ss.fields.forEach((f) => {
                    if (f.type === FieldType.REFERENCE) {
                        f.referenceCollection = referencesMap.get(f.reference);
                        f.isLazyCollection = this.LAZY_REFERENCES.includes(f.reference);

                        if (f.reference === ReferenceType.EMPLOYEE) {
                            f.selectName = "fio";
                        }
                    }
                });
            });
        });

        return template;
    }
}
