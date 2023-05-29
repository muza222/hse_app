import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionStoreService } from '@core/session-store/session-store.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { some as _some } from 'lodash/fp';
import { HseAlertService } from '@core/hse-alert/hse-alert.service';
import { environment } from '@env/environment';


@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  /**
   * Количество активных запросов
   */
  private activeRequestCount = 0;

  /**
   * Список url, для которых не отображать лоудер
   * Пример: '/subjects'
   */
  private skippedUrls: Array<string> = [
    environment.storageUrl
  ];

  /**
   * http методы, для которых не отображать лоудер
   * Пример: 'GET'
   */
  private skippedMethods: Array<string> = [];


  constructor(private sessionStoreService: SessionStoreService,
              private hseAlert: HseAlertService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.interceptRequest(request);

    return next.handle(request).pipe(
      tap({
          error: (event) => {
            if (event instanceof HttpErrorResponse) {
              if (event.status && event.status !== 401 && !this.shouldBypassUrl(request.url)) {
                this.hseAlert.error(event.error && event.error.message || event.statusText);
              }

              if (event.status && event.status === 401) {
                this.sessionStoreService.setSession(null);
              }
            }
          },
          finalize: () => {
            this.interceptResponse();
          }
        }
      )
    );
  }

  /**
   * Перехватить запрос
   * В параметр запроса может попасть не только HttpRequest,
   * но также синтетический объект, переданный в перехватчике запроса restangular'a.
   */
  interceptRequest(request: any) {
    if (!this.shouldBypass(request)) {
      if (this.activeRequestCount === 0) {
        // this.kitLoader.show();
      }

      this.activeRequestCount++;
    }
  }

  /**
   * Перехватить ответ
   */
  interceptResponse() {
    this.activeRequestCount--;
    if (this.activeRequestCount < 0) {
      this.activeRequestCount = 0;
    }

    if (this.activeRequestCount === 0) {
      // this.kitLoader.hide();
    }
  }

  /**
   * Проверить, следует пропустить запрос по заданному url
   */
  private shouldBypassUrl(url: string): boolean {
    return _some((skipped: string) => {
      return url.indexOf(skipped) !== -1;
    })(this.skippedUrls);
  }

  /**
   * Проверить, следует ли пропустить запрос, переданный в параметр
   */
  private shouldBypass(request: HttpRequest<any>): boolean {
    return this.shouldBypassMethod(request.method)
      || this.shouldBypassUrl(request.url);
  }

  /**
   * Проверить, следует ли пропустить запрос с заданным http-методом
   */
  private shouldBypassMethod(method: string) {
    return _some((skipped: string) => {
      return new RegExp(skipped, 'i').test(method);
    })(this.skippedMethods);
  }
}
