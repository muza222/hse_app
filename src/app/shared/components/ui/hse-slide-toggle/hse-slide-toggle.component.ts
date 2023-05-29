import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'hse-slide-toggle',
  templateUrl: './hse-slide-toggle.component.html',
  styleUrls: ['./hse-slide-toggle.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HseSlideToggleComponent),
      multi: true
    }
  ]
})
export class HseSlideToggleComponent implements OnInit, ControlValueAccessor {
  private innerValue: boolean;

  @Input() disabled: boolean;

  constructor() {}

  ngOnInit(): void {}

  get model(): boolean {
    return this.innerValue;
  }

  set model(value) {
    this.innerValue = value;
    this.onChange(this.innerValue);
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value): void {
    this.innerValue = value;
  }

}
