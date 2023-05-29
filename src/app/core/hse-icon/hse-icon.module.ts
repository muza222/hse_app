import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HseIconService } from './hse-icon.service';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [HseIconService]
})
export class HseIconModule { }
