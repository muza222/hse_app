import { Component } from '@angular/core';
import { HseAlertService } from '../hse-alert.service';
import { AlertType } from '../alert-type.enum';
import { HseAlert } from '@core/hse-alert/hse-alert.class';

@Component({
  selector: 'hse-alert',
  templateUrl: './hse-alert.component.html',
  styleUrls: ['./hse-alert.component.scss']
})
export class HseAlertComponent {

  alertTypes = AlertType;

  constructor(public base: HseAlertService) {  }

  removeAlert(alert: HseAlert) {
    this.base.removeAlert(alert.id);
  }
}
