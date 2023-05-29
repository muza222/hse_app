import { LocalizedName } from '@core/interfaces/localized-name';
import { TemplateSubsectionField } from '@core/backend/dictionary/template/template-subsection-field.interface';

export interface TemplateSubSection {
  id: number;
  name: LocalizedName;
  code: string;
  isVisible: boolean;
  isMulti: boolean;
  fields: TemplateSubsectionField[];
}
