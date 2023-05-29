import { LocalizedName } from '@core/interfaces/localized-name';
import { TemplateSubSection } from '@core/backend/dictionary/template/template-subsection.interface';

export interface TemplateSection {
  id: number;
  name: LocalizedName;
  code: string;
  subsections: TemplateSubSection[];
}
