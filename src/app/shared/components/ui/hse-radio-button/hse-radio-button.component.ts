import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { random as _random } from 'lodash/fp';

@Component({
  selector: 'hse-radio-button',
  templateUrl: './hse-radio-button.component.html',
  styleUrls: ['./hse-radio-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HseRadioButtonComponent),
      multi: true
    }
  ]
})
export class HseRadioButtonComponent implements OnInit, ControlValueAccessor {

  /**
   * Флаг активности радио кнопки
   */
  @Input() disabled: boolean;

  @Input() name: string;

  @Input() value: any;

  /**
   * Нужен ли маленький чекбокс
   * Default: false
   */
  @Input() small: boolean;
  @Input() square: boolean;

  radioButtonId: string;
  minValue = 1000000;
  maxValue = 9999999;

  private innerValue: boolean;

  constructor() {
    this.radioButtonId = `${_random(this.minValue, this.maxValue)}-${Date.now()}`;
  }

  ngOnInit() {}

  get model(): boolean {
    return this.innerValue;
  }

  set model(val) {
    this.innerValue = val;
    this.onChange(this.innerValue);
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(val) {
    this.innerValue = val;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

}
