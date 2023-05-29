import { Unit } from '@core/backend/dictionary/unit/unit.interface';
import { LocalizedName } from '@core/interfaces/localized-name';

export interface Employee {
  id: number;
  externalId: string;
  fio: LocalizedName;
  surname: LocalizedName;
  firstname: LocalizedName;
  patronymic: LocalizedName;
  position: string;
  unit: Unit;
}
