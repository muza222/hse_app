import { ApplicationGetResponse } from '@core/backend/application-by-sr/application-get-response';
import { PageableResponse } from '@core/backend/applications-get-by-filters-response/pageable-response';

export interface ApplicationsGetByFiltersResponse {
    applications: Array<ApplicationGetResponse>;
    pageable: PageableResponse;
}
