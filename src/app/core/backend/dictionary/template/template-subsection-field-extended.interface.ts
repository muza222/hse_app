import { TemplateSubsectionField } from '@core/backend/dictionary/template/template-subsection-field.interface';
import { TemplateSubSectionExtended } from '@core/backend/dictionary/template/template-subsection-extended.interface';

export interface TemplateSubsectionFieldExtended extends TemplateSubsectionField {
  enumCollection?: any[];
  referenceCollection?: any[];
  isLazyCollection?: boolean;
  selectName?: string;
  needShow?: boolean;
  parent?: TemplateSubSectionExtended;
  minDate?: string;
  fileName?: string;
}
