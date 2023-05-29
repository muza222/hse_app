import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HseIconModule } from './hse-icon/hse-icon.module';
import { SessionStoreService } from '@core/session-store/session-store.service';
import { SsoService } from '@core/backend/sso.service';
import { HseAlertModule } from '@core/hse-alert/hse-alert.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HseIconModule,
    HseAlertModule
  ],
  providers: [
    SessionStoreService,
    SsoService,
  ],
  exports: [
    HseIconModule,
    HseAlertModule
  ]
})
export class CoreModule { }
