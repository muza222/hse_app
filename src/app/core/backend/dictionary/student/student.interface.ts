import { LocalizedName } from '@core/interfaces/localized-name';

export interface Student {
  id: number;
  externalId: string;
  fio: LocalizedName;
  surname: LocalizedName;
  firstname: LocalizedName;
  patronymic: LocalizedName;
}
