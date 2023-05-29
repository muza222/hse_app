import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop as _noop } from 'lodash/fp';
import _guid from '@tools/guid';

@Component({
  selector: 'hse-input',
  templateUrl: './hse-input.component.html',
  styleUrls: ['./hse-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HseInputComponent),
      multi: true
    }
  ]
})
export class HseInputComponent implements OnInit, ControlValueAccessor {
  private innerValue: any;
  public inputId: string;
  public showPassword = false;
  @Input() disabled = false;
  @Input() enabledAutocomplete = false;
  @Input() tabIndex = -1;
  @Input() type = 'text';
  @Input() step: number;
  @Input() placeholder = '';
  @Input() search: boolean;
  @Input() width: number; // 200;
  @Input() min: number;
  @Input() max: number;
  @Input() extraButtonTitle: string;
  @Input() small = false;
  @Input() rounded = false;
  @Input() mask: string;
  @Input() maskPrefix: string;
  @Input() dropSpecialCharacters = true;

  @Output() focused = new EventEmitter<any>();
  @Output() blurred = new EventEmitter<any>();
  @Output() extraButtonAction = new EventEmitter<any>();

  @ViewChild('input', {static: true}) inputElem: ElementRef;

  onChange: any = _noop;
  onTouched: any = _noop;

  get isTypePassword(): boolean {
    return Boolean(this.type) && this.type === 'password';
  }

  get model(): string {
    return this.innerValue;
  }

  set model(value) {
    this.innerValue = value;
    this.onChange(this.innerValue);
  }

  ngOnInit() {
    this.inputId = _guid();

    if (this.type === 'number') {
      this.inputElem.nativeElement.setAttribute('min', this.min);
      this.inputElem.nativeElement.setAttribute('max', this.max);
    }
  }

  writeValue(value: any) {
    this.model = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  emitFocusEvent() {
    this.focused.emit();
  }

  emitBlurEvent() {
    this.blurred.emit();
    this.onTouched();
  }

  onClickExtraButton(event: Event) {
    event.stopPropagation();
    this.extraButtonAction.emit();
  }

  showInputValue(show: boolean) {
    this.showPassword = show;
  }
}
