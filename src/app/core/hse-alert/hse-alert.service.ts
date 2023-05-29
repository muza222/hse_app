import { Injectable } from '@angular/core';
import { HseAlert } from './hse-alert.class';
import { find as _find, findIndex as _findIndex } from 'lodash/fp';
import { AlertType } from './alert-type.enum';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, iif, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HseAlertService {
  alerts: HseAlert[] = [];
  alertTimeout = 5000;

  constructor(private translateService: TranslateService) { }

  success(msg: string, isHtml?: boolean, isTranslate?: boolean, translateParams?: object) {
    this.add(AlertType.SUCCESS, msg, isHtml, isTranslate, translateParams);
  }

  error(msg: string, isHtml?: boolean, isTranslate?: boolean, translateParams?: object) {
    this.add(AlertType.ERROR, msg, isHtml, isTranslate, translateParams);
  }

  info(msg: string, isHtml?: boolean, isTranslate?: boolean, translateParams?: object) {
    this.add(AlertType.INFO, msg, isHtml, isTranslate, translateParams);
  }

  removeAlert(id: string) {
    if (!id) {
      return;
    }

    const alert: HseAlert = _find({id})(this.alerts) as HseAlert;

    if (alert) {
      alert.isFadeOut = true;

      setTimeout(() => {
        const ix = _findIndex({id})(this.alerts);
        this.alerts.splice(ix, 1);
      }, 1000);
    }
  }

  private add(type: AlertType, msg: string, isHtml: boolean, isTranslate:boolean, translateParams: any) {
    this.getTitle(type)
      .pipe(
        mergeMap( (v) => combineLatest([
          of(v),
          iif(() => isTranslate, this.translateService.get(msg, translateParams), of(msg))
        ])),
      ).subscribe(([title, message]) => {
        const newAlert = new HseAlert(type, title, message, isHtml);

        this.alerts.push(newAlert);
        this.autoRemoveAlert(newAlert);
      }, console.error);
  }

  private autoRemoveAlert(newAlert: HseAlert) {
    setTimeout(() => {
      this.removeAlert(newAlert.id);
    }, this.alertTimeout);
  }

  private getTitle(alertType: AlertType): Observable<string> {
    return this.translateService.get(`ALERT_TITLE.${alertType.toUpperCase()}`);
  }
}
