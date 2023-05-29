import { BaseEntity } from '@core/interfaces/base-entity.interface';

export interface Level extends BaseEntity {
  code: string;
  externalId: string;
}
