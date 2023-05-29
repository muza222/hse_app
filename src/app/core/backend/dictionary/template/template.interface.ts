import { LocalizedName } from '@core/interfaces/localized-name';
import { TemplateSection } from '@core/backend/dictionary/template/template-section.interface';

export interface Template {
  id: number;
  name: LocalizedName;
  code: string;
  sections: TemplateSection[];
}
