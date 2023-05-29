import { TemplateSubSectionExtended } from '@core/backend/dictionary/template/template-subsection-extended.interface';
import { TemplateSection } from '@core/backend/dictionary/template/template-section.interface';

export interface TemplateSectionExtended extends TemplateSection {
  subsections: TemplateSubSectionExtended[];
}
