import _guid from '@tools/guid';
import { AlertType } from '@core/hse-alert/alert-type.enum';

export class HseAlert {
  id: string;
  isFadeOut: boolean;

  constructor(public type: AlertType,
              public title: string,
              public message: string,
              public isHtml: boolean) {
    this.id = _guid();
  }
}
