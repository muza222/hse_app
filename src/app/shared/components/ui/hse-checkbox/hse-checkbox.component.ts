import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { random as _random } from 'lodash/fp';

@Component({
  selector: 'hse-checkbox',
  templateUrl: './hse-checkbox.component.html',
  styleUrls: ['./hse-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HseCheckboxComponent),
      multi: true
    }
  ]
})
export class HseCheckboxComponent implements ControlValueAccessor {
  /**
   * Флаг применения обновленного дизайна
   */
  @Input() redesigned = false;

  /**
   * Флаг активности чекбокса
   */
  @Input() disabled: boolean;

  /**
   * Тип чекбокса: 'square', 'round', 'small'
   * Default: 'square'
   */
  @Input() type: string;

  checkboxId: string;
  minValue = 1000000;
  maxValue = 9999999;

  private innerValue: boolean;

  constructor() {
    this.checkboxId = `${_random(this.minValue, this.maxValue)}-${Date.now()}`;
  }

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
    // this.model = val;
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
