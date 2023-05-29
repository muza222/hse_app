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
  selector: 'hse-textarea',
  templateUrl: './hse-textarea.component.html',
  styleUrls: ['./hse-textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HseTextareaComponent),
      multi: true
    }
  ]
})

export class HseTextareaComponent implements OnInit, ControlValueAccessor {
  private innerValue: any;
  public textareaId: string;
  @Input() disabled = false;
  @Input() tabIndex = -1;
  @Input() type = 'text';
  @Input() step: number;
  @Input() placeholder = '';
  @Input() width: number; // 200;
  @Input() extraButtonTitle: string;
  @Input() small = false;
  @Input() rounded = false;

  @Output() focused = new EventEmitter<any>();
  @Output() blurred = new EventEmitter<any>();
  @Output() extraButtonAction = new EventEmitter<any>();

  @ViewChild('textarea', {static: true}) textareaElem: ElementRef;

  onChange: any = _noop;
  onTouched: any = _noop;

  get model(): string {
    return this.innerValue;
  }

  set model(value) {
    this.innerValue = value;
    this.onChange(this.innerValue);
  }

  ngOnInit() {
    this.textareaId = _guid();
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
}
