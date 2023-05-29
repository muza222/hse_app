import { BaseEntity } from '@core/interfaces/base-entity.interface';

export interface Course extends BaseEntity {
  code: string;
  externalId: string;
  educationLevelId: number;
}
