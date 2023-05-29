import { Pipe, PipeTransform } from '@angular/core';
import { LocalizedName } from '@core/interfaces/localized-name';
import { LocaleChoiceService } from '@core/locale-choice/locale-choice.service';

@Pipe({ name: 'localizedString', pure: false })
export class LocalizedStringPipe implements PipeTransform {
  constructor(private readonly localeChoice: LocaleChoiceService) {}

  transform(name?: LocalizedName | string): string | null {
    if (!name) {
      return null;
    }

    if (typeof name === 'string') {
      return name as string;
    }

    const selectedLang: 'ru' | 'en' = this.localeChoice.currentLocale.name as 'ru' | 'en';

    return name[selectedLang] || null;
  }
}
