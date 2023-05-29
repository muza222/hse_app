import { TemplateSectionExtended } from '@core/backend/dictionary/template/template-section-extended.interface';
import { Template } from '@core/backend/dictionary/template/template.interface';

export interface TemplateExtended extends Template {
  sections: TemplateSectionExtended[];
}
