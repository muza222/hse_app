import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { LuxonDateAdapter, MAT_LUXON_DATE_FORMATS } from '@angular/material-luxon-adapter';
import { DateTime } from 'luxon';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'hse-date-picker',
  templateUrl: './hse-date-picker.component.html',
  styleUrls: ['./hse-date-picker.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_DATE_FORMATS, useValue: MAT_LUXON_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'ru-RU'
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HseDatePickerComponent),
      multi: true
    }
  ]
})

export class HseDatePickerComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() mask: string;
  @Input() disabled: boolean;
  @Input() minDateInput: string;
  @Input() maxDateInput: string;

  @Output() changed = new EventEmitter<string>();

  modelValue = null;
  maxDate: Date;
  minDate: Date;

  ngOnInit(): void {
    this.maxDate = new Date(this.maxDateInput);
    this.minDate = new Date(this.minDateInput);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['minDateInput'] && changes['minDateInput'].currentValue) {
      this.minDate = new Date(this.minDateInput);
    }
  }

  dateChange(e) {
    const localeDate = `${e.value}`.slice(0, 10);
    this.onChange(localeDate);
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  writeValue(value: any) {
    this.modelValue = DateTime.fromISO(value);
    this.changeValue();
  }

  protected changeValue() {
    if (!this.modelValue) {
      return;
    }
  }
}
