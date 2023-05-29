import { LocalizedName } from '@core/interfaces/localized-name';
import { EppItem } from '@core/interfaces/epp-item.interface';
import { BaseEntity } from '@core/interfaces/base-entity.interface';

export interface EppItemExtended extends EppItem {
  supervisorParsed?: {id: number, fio: LocalizedName};
  tagsParsed?: BaseEntity[];
}
