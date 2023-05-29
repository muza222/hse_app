import { LocalizedName } from '@core/interfaces/localized-name';
import { EppFieldType } from '@core/backend/fields/epp-field-type';
import { EppStatusResponse } from '@core/backend/application-scheme/epp-status-response';
import { EppStatus } from '@core/enums';


export interface EppFieldResponse {
    id: string;
    name: LocalizedName;
    applicant: string;
    date: number;
    description: LocalizedName;
    type: EppFieldType;
    enumList: string;
    mask: string;
    validationRegexp: string;
    isMulty: boolean;
    hint: string;
    status: EppStatus;
    executor: string;
    executorId: string;
}
