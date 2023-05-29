import { Injectable, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionStoreService } from '@core/session-store/session-store.service';
import enUS from '../assets/i18n/en-US.json';
import ruRU from '../assets/i18n/ru-RU.json';
import { LocaleChoiceService } from '@core/locale-choice/locale-choice.service';
import { SsoService } from '@core/backend/sso.service';
import { Settings } from 'luxon';


@Injectable({
  providedIn: 'root'
})
export class AppLoadService {
  constructor(private injector: Injector,
              private store: SessionStoreService,
              private localeChoice: LocaleChoiceService,
              private translateService: TranslateService,
              private ssoService: SsoService) {
  }

  /**
   * Инициализация приложения
   */
  async initApp(): Promise<any> {
    this.setLanguageSettings();
    this.store.setSession(null);
    try {
      if (this.store.getAccessToken()) {
        const user = await this.ssoService.getUser();
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Сконфигурировать всё, что связано с языком
   */
  setLanguageSettings() {
    this.translateService.setTranslation('en-US', enUS);
    this.translateService.setTranslation('ru-RU', ruRU);
    this.localeChoice.initLang();
    const setLang = this.localeChoice.currentLocale.id;

    this.translateService.currentLang = setLang;
    this.translateService.addLangs([setLang]);
    this.translateService.setDefaultLang(setLang);

    document.documentElement.lang = setLang;
    Settings.defaultLocale = 'ru-RU';
  }
}
