import { EppFieldResponse } from '@core/backend/fields/epp-field-response';

export interface EppTemplateFieldResponse {
    field: EppFieldResponse;
    access: FieldAccessType;
    ordinal: number;
    isRequired: boolean;
}
