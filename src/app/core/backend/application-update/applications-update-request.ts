import { FieldRequest } from '@core/backend/application-create/field-request';

export interface ApplicationsUpdateRequest {
    id: bigint;
    roleId: number;
    statusId: bigint;
    response: string;
    employeeSrId: string;
    fields: Array<FieldRequest>;
}
