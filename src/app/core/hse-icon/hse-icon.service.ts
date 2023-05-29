import { Injectable, SecurityContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { finalize, map, share } from 'rxjs/operators';

import icons from './icons.const';
import { HseIcon, HseIconStore } from './hse-icon.interface';

@Injectable({
  providedIn: 'root'
})
export class HseIconService {
  icons: HseIconStore = icons;
  inProgressUrlFetches: Map<string, Observable<any>> = new Map();

  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  /**
   * Получаем иконку по ее названию.
   * Если она уже загружена - отдаем сразу
   * Если не загружена - загружаем ее и добавляем в коллекцию.
   */
  getIconByName(name: string): Observable<any> {
    const foundIcon = this.icons.get(name);

    if (foundIcon) {
      const inProgressFetch = this.inProgressUrlFetches.get(foundIcon.url);

      if (inProgressFetch) {
        return inProgressFetch;
      }

      if (Boolean(foundIcon.data)) {
        return of(foundIcon.data);
      }

      const fetchIcon$ = this.downloadIcon(name, foundIcon);
      this.inProgressUrlFetches.set(foundIcon.url, fetchIcon$);

      return fetchIcon$;
    }

    console.error(`Icon with name "${name}" not found`);

    return of(null);
  }

  /**
   * Загружаем и сохраняем иконку
   */
  downloadIcon(name: string, icon: HseIcon): Observable<any> {
    const resource = this.sanitizer.bypassSecurityTrustResourceUrl(icon.url);
    const url = this.sanitizer.sanitize(SecurityContext.URL, resource);

    return this.httpClient.get(url as string, { responseType: 'text' })
      .pipe(
        finalize(() => this.inProgressUrlFetches.delete(icon.url)),
        share(),
        map((data) => {
          const loadedIcon = {...icon, data};
          this.icons.set(name, loadedIcon);

          return data;
        })
      );

  }
}
