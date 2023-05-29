import { EppTemplateResponse } from '@core/backend/templates/epp-template-response';
import { EppStatusResponse } from '@core/backend/application-scheme/epp-status-response';

export interface ApplicationGetResponse {
    id: bigint;
    template: EppTemplateResponse;
    status: EppStatusResponse;
    createdDateTime: Date;
    lastModifiedDateTime: Date;
}

