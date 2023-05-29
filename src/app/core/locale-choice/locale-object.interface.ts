import { Locale } from '@core/enums';

export interface LocaleObject {
  id: Locale;
  name: string;
  fullName: string;
  displayName?: string;
  isActive?: boolean;
}
