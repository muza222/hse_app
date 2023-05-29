import { LocalizedName } from '@core/interfaces/localized-name';

export interface EppItem {
  id: number;
  type: LocalizedName;
  status: LocalizedName;
  img: string;
  eppNumber: string;
  name: LocalizedName;
  supervisor: string;
  tags: string;
  startDate: string;
  finishDate: string;
  // vacanciesAll: number;
  // vacanciesFree: number;
  // teamsMember: number;
  // laborIntensityOnVacancy: number;
  endDateApplication: string;
  vacanciesNameCount: number;
}
