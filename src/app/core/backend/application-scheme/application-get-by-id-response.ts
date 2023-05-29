import { EppTemplateResponse } from '@core/backend/templates/epp-template-response';
import { EppStatusResponse } from '@core/backend/application-scheme/epp-status-response';
import { FieldResponse } from '@core/backend/application-scheme/field-response';

export interface ApplicationGetByIdResponse {
    id: bigint;
    template: EppTemplateResponse;
    status: EppStatusResponse;
    response: string;
    createdDateTime: Date;
    lastModifiedDateTime: Date;
    employeeSrId: string;
    fields: Array<FieldResponse>;
}
