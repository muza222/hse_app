import { LocalizedName } from '@core/interfaces/localized-name';
import { DisplayCondition } from '@core/backend/dictionary/template/display-condition.interface';
import { FieldType } from '@core/backend/dictionary/template/field-type.enum';
import { ReferenceType } from '@core/backend/dictionary/template/reference-type.enum';
import { AccessType } from '@core/backend/dictionary/template/access-type.enum';

export interface TemplateSubsectionField {
  id: number;
  name: LocalizedName;
  code: string;
  type: FieldType;
  reference: ReferenceType;
  enumList: any[];
  mask: string;
  validationRegexp: string;
  access: AccessType;
  ordinal: number;
  isRequired: boolean;
  isMulti?: boolean;
  hint?: string;
  showDepartment?: boolean;
  displayConditions: DisplayCondition[];
}
