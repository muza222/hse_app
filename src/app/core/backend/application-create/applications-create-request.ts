import { FieldRequest } from '@core/backend/application-create/field-request';

export interface ApplicationsCreateRequest {
    srId: string;
    roleId: number;
    templateId: number;
    fields: Array<FieldRequest>;
}
