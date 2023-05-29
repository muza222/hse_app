import { TemplateSubsectionFieldExtended } from '@core/backend/dictionary/template/template-subsection-field-extended.interface';
import { TemplateSubSection } from '@core/backend/dictionary/template/template-subsection.interface';
import { TemplateSection } from '@core/backend/dictionary/template/template-section.interface';

export interface TemplateSubSectionExtended extends TemplateSubSection {
  fields: TemplateSubsectionFieldExtended[];
  parent?: TemplateSection;
  showTitle?: boolean;
  showFields?: boolean;
  showButton?: boolean;
}
