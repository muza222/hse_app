// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Locale } from '@core/enums';

export const environment = {
  production: false,
  defaultLang: Locale.RU_RU,
  storageUrl: 'https://devstorage.hse.ru',
  langs: [
    {id: Locale.RU_RU, name: 'ru', fullName: 'Русский (RU)'},
    {id: Locale.EN_US, name: 'en', fullName: 'English (EN)'}
  ],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
