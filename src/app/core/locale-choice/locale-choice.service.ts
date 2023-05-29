import { Injectable } from '@angular/core';
import { Locale } from '@core/enums';
import { SessionStoreService } from '@core/session-store/session-store.service';
import { environment } from '@env/environment';
import { LocaleObject } from '@core/locale-choice/locale-object.interface';

import { find as _find, map as _map } from 'lodash/fp';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocaleChoiceService {

  public readonly LOCALES: LocaleObject[] = this.mapLocales();
  public currentLocale: LocaleObject = null;

  constructor(private store: SessionStoreService) {
  }

  initLang() {
    const storeLocale = this.store.getUserLang();
    const availableLocale = environment.langs.find((lang) => lang.id === storeLocale);
    let targetLocale = environment.defaultLang;

    if (storeLocale && Boolean(availableLocale)) {
      targetLocale = storeLocale as Locale;
    }

    this.setLang(targetLocale);
  }

  setLang(id: Locale) {
    for (const locale of this.LOCALES) {
      locale.isActive = locale.id === id;
    }

    this.currentLocale = this.LOCALES.find((locale) => locale.isActive);

    this.store.setUserLang(id);
  }
  getCurrentLocale() {
    return this.currentLocale;
  }

  private mapLocales(): LocaleObject[] {
    return _map<LocaleObject, LocaleObject>((lang) => {
      return {
        id: lang.id,
        name: lang.name,
        fullName: lang.fullName,
        isActive: false
      };
    })(environment.langs);
  }
}
