import { ApplicationGetResponse } from '@core/backend/application-by-sr/application-get-response';

export interface ApplicationsGetBySrIdResponse {
    applications: Array<ApplicationGetResponse>;
}
