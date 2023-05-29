import { LocalizedName } from '@core/interfaces/localized-name';

export interface FieldResponse {
    id: bigint;
    name: LocalizedName;
    value: string;
}
