import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HseAlertComponent } from './hse-alert/hse-alert.component';
import { HseAlertService } from './hse-alert.service';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    HseAlertComponent
  ],
  providers: [
    HseAlertService
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    HseAlertComponent
  ]
})
export class HseAlertModule { }
