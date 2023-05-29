import { LocalizedName } from '@core/interfaces/localized-name';
import { BaseEntity } from '@core/interfaces/base-entity.interface';

export interface Program extends BaseEntity {
  facultyName: LocalizedName;
}
