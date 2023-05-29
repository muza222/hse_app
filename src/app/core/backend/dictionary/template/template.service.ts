import { Injectable } from "@angular/core";
import { Constants } from "@core/constants";
import { HttpClient } from "@angular/common/http";
import { Template } from "@core/backend/dictionary/template/template.interface";
import { firstValueFrom } from "rxjs";
import { EppStatus, UserType } from "@core/enums";
import { TemplateSection } from "./template-section.interface";
import { TemplateSubSection } from "./template-subsection.interface";
import { TemplateSubsectionField } from "./template-subsection-field.interface";
import { FieldType } from "./field-type.enum";
import { AccessType } from "./access-type.enum";
import { ReferenceType } from "./reference-type.enum";

@Injectable({
    providedIn: "root",
})
export class TemplateService {
    private readonly URL = `${Constants.DICTIONARY_API_URL}/template`;

    constructor(private http: HttpClient) {}

    get(status: EppStatus, templateId: number, role: UserType): Promise<Template> {
        const params = {
            status,
            templateId,
            role,
        };

        return Promise.resolve({
            id: 123,
            name: {
                en: "Справка об обучении",
                ru: "Справка об обучении",
            },
            code: "123",
            sections: [
                {
                    id: 1,
                    name: {
                        ru: "Справка об обучении",
                        en: "Справка об обучении",
                    },
                    // code: "1",
                    subsections: [
                        {
                            id: 2323,
                            code: "1231",
                            isVisible: true,
                            fields: [
                                {
                                    id: 13,
                                    name: {
                                        ru: "ФИО Студента",
                                        en: "123",
                                    },
                                    code: "name",
                                    type: FieldType.INPUT,
                                    access: AccessType.VIEW,
                                } as TemplateSubsectionField,
                                {
                                    id: 1,
                                    name: {
                                        ru: "Дата рождения студента",
                                        en: "123",
                                    },
                                    code: "dateOfBirth",
                                    type: FieldType.INPUT,
                                    access: AccessType.VIEW,
                                } as TemplateSubsectionField,
                                {
                                    id: 1,
                                    name: {
                                        ru: "Факультет",
                                        en: "123",
                                    },
                                    code: "faculty",
                                    type: FieldType.INPUT,
                                    access: AccessType.VIEW,
                                } as TemplateSubsectionField,
                                {
                                    id: 1,
                                    name: {
                                        ru: "Уровень образования",
                                        en: "123",
                                    },
                                    code: "level",
                                    type: FieldType.INPUT,
                                    access: AccessType.VIEW,
                                } as TemplateSubsectionField,
                                {
                                    id: 1,
                                    name: {
                                        ru: "Образовательная программа",
                                        en: "123",
                                    },
                                    code: "ep",
                                    type: FieldType.INPUT,
                                    access: AccessType.VIEW,
                                } as TemplateSubsectionField,
                                {
                                    id: 1,
                                    name: {
                                        ru: "Курс",
                                        en: "123",
                                    },
                                    code: "course",
                                    type: FieldType.INPUT,
                                    access: AccessType.VIEW,
                                } as TemplateSubsectionField,
                                {
                                    id: 1,
                                    name: {
                                        ru: "Статус студента",
                                        en: "123",
                                    },
                                    code: "studentStatus",
                                    type: FieldType.INPUT,
                                    access: AccessType.VIEW,
                                } as TemplateSubsectionField,
                                {
                                    id: 1,
                                    name: {
                                        ru: "Номер телефона",
                                        en: "123",
                                    },
                                    code: "phoneNumber",
                                    type: FieldType.INPUT,
                                    access: AccessType.VIEW,
                                } as TemplateSubsectionField,
                                {
                                    id: 1,
                                    name: {
                                        ru: "Электронная почта",
                                        en: "123",
                                    },
                                    code: "email",
                                    type: FieldType.INPUT,
                                    access: AccessType.VIEW,
                                } as TemplateSubsectionField,
                                {
                                    id: 1,
                                    name: {
                                        ru: "Комментарии системные",
                                        en: "123",
                                    },
                                    code: "systemComment",
                                    type: FieldType.INPUT,
                                    access: AccessType.VIEW,
                                } as TemplateSubsectionField,
                                {
                                    id: 1,
                                    name: {
                                        ru: "Комментарии пользовательские",
                                        en: "123",
                                    },
                                    code: "userComment",
                                    type: FieldType.INPUT,
                                    access: AccessType.VIEW,
                                } as TemplateSubsectionField,
                            ],
                        } as TemplateSubSection,
                        {
                            id: 1,
                            // name: {
                            //     ru: "Справка об обучении",
                            //     en: "123",
                            // },
                            code: "1",
                            isVisible: true,
                            fields: [
                                {
                                    id: 1,
                                    name: {
                                        ru: "Статус",
                                        en: "123",
                                    },
                                    code: "epp_status",
                                    type: FieldType.INPUT,
                                    access: AccessType.VIEW,
                                } as TemplateSubsectionField,
                                {
                                    id: 2,
                                    name: {
                                        ru: "Назначить исполнителя",
                                        en: "123",
                                    },
                                    code: "executor",
                                    type: FieldType.ENUM,
                                    access: AccessType.EDIT,
                                    enumList: ["Косачевская Наталья Владимировна", "Пак Татьяна Альбертовна"],
                                } as TemplateSubsectionField,
                                {
                                    id: 2,
                                    name: {
                                        ru: "Добавить новый комментарий",
                                        en: "123",
                                    },
                                    code: "comment",
                                    type: FieldType.TEXTAREA,
                                    access: AccessType.EDIT,
                                } as TemplateSubsectionField,
                                {
                                    id: 2,
                                    name: {
                                        ru: "Документ",
                                        en: "123",
                                    },
                                    code: "comment",
                                    type: FieldType.FILE,
                                    access: AccessType.EDIT,
                                } as TemplateSubsectionField,
                            ],
                        } as TemplateSubSection,
                    ],
                } as TemplateSection,
            ],
        } as Template);

        // TODO: remove after backend up
        return firstValueFrom(this.http.get<Template>(this.URL, { params }));
    }
}
