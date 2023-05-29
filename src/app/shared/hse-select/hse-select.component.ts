import { Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HseSelectId } from '@shared/hse-select/hse-select-id.type';
import { compact as _compact, filter as _filter, find as _find, lowerCase as _lowerCase, noop as _noop } from 'lodash/fp';
import { MatMenu, MenuPositionX, MenuPositionY } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
/**
 * Компонент для выпадающего списка выбора.
 * Использование:
 *
 *  <hse-select [collection]="selectCollection"
 *              [(ngModel)]="selectModel"
 *              [idField]="idField"
 *              [nameField]="nameField"
 *              (ngModelChange)="onChangeValue($event)"
 *              [placeholder]="'Choose item'"
 *              [disabled]="true"
 *              [width]="200"></hse-select>
 *
 */

@Component({
  selector: 'hse-select',
  templateUrl: './hse-select.component.html',
  styleUrls: ['./hse-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HseSelectComponent),
      multi: true
    }
  ]
})

export class HseSelectComponent implements OnInit, OnChanges, ControlValueAccessor {
  private defaultWidth = '396px';
  private showOptionsList = false;
  private modelValue: HseSelectId;

  public selected: any = null;
  public onChange: any = _noop;
  public onTouched: any = _noop;

  inputValue = '';
  filteredCollection: any[] = [];
  selectLabel: string;
  dropDownWidth = this.defaultWidth;

  // Флаг переключения на обновленные стили
  @Input() redesigned = false;
  @Input() collection: any[];
  @Input() optionTpl?: any;
  @Input() idField?: string;
  @Input() nameField?: string;
  @Input() nullText?: string;
  @Input() placeholder?: string;
  @Input() width?: string;
  @Input() disabledText?: string;
  @Input() disabled?: boolean;
  @Input() customStyle?: any;
  @Input() disablePlaceholder = false;
  @Input() equalWidth = true;
  @Input() customClass?: string;
  @Input() xPos: MenuPositionX = 'after';
  @Input() yPos: MenuPositionY = 'below';
  @Input() withInput: boolean;
  @Input() withPlaceholder: boolean;
  @Input() tabIndex = -1;

  @Output() focused = new EventEmitter<any>();
  @Output() blurred = new EventEmitter<any>();
  @Output() menuClosed?: EventEmitter<any> = new EventEmitter<any>();
  @Output() menuToggle?: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('menu') menu: MatMenu;
  @ViewChild('inputElement') input: ElementRef;
  @ViewChild('notDisabled') menuTrigger: ElementRef;

  constructor(private elementRef: ElementRef,
              private translateService: TranslateService) {
    this.translateService.get('COMMON')
      .subscribe((common: any) => {
        this.selectLabel = common.SELECT;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filteredCollection = this.collection;

    if (Boolean(changes['collection']) && !changes['collection'].isFirstChange()) {
      this.setSelectedItem(this.modelValue);
    }
  }

  ngOnInit() {
    this.idField = this.idField || 'id';
    this.nameField = this.nameField || 'name';
    this.placeholder = this.placeholder || this.selectLabel;
    this.width = this.width || this.defaultWidth;
  }

  writeValue(value: HseSelectId) {
    this.changeValue(value, false);
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

  /**
   * Изменить значение селекта
   */
  changeValue(value: HseSelectId, isEmitValue = false) {
    this.setSelectedItem(value);
    this.modelValue = Boolean(this.selected)
      ? this.selected[this.idField]
      : null;

    if (isEmitValue) {
      this.onChange(this.modelValue);
    }
  }

  /**
   * callback на открытие выпадающего списка
   */
  optionListOpened() {
    this.showOptionsList = true;
    this.menuToggle.emit(this.showOptionsList);
    this.dropDownWidth = window.getComputedStyle(this.menuTrigger.nativeElement).getPropertyValue('width');

    // для корректной работы [kitValMessage]
    setTimeout(() => {
      this.menu['_elementRef'].nativeElement.focus();

      if (this.input) {
        this.input.nativeElement.focus();
      }
    });
  }

  /**
   * callback на закрытие выпадающего списка
   */
  optionListClosed() {
    this.showOptionsList = false;
    this.onTouched();
    this.menuClosed.emit(this.modelValue);
    this.menuToggle.emit(this.showOptionsList);
  }

  /**
   * Выбрать значение в селекте
   * value - idField выбранного элемента
   */
  setSelectedItem(value: HseSelectId) {
    this.selected = _find<any>((item) => item[this.idField] === value)(this.filteredCollection) || null;
    this.inputValue = this.selectedName;

    if (this.withInput) {
      this.filterCollection(this.inputValue);
    }
  }

  /**
   * Получить отображаемое имя выбранного элемента
   */
  get selectedName() {
    return this.selected ? this.selected[this.nameField] : null;
  }

  /**
   * Получить css-классы для заголовка селекта
   * disabled - флаг активности селекта
   */
  getHeaderClasses(disabled: any) {
    return _compact([
      disabled ? 'hse-select-header-disabled' : 'hse-select-header',
      this.showOptionsList ? 'active' : '',
      this.selected || this.nullText ? 'has-value' : '',
      this.disablePlaceholder ? 'disabled-placeholder' : ''
    ])
      .join(' ');
  }

  /**
   * Получить css-классы для плэйсхолдера селекта
   */
  getPlaceholderClass() {
    return _compact([
      'hse-select-label',
      this.selected || this.nullText ? 'active' : '',
      this.disablePlaceholder && (this.selected || this.nullText) ? 'disabled' : ''
    ])
      .join(' ');
  }

  /**
   * Получить css-классы для контейнера плэйсхолдера селекта
   */
  getPlaceholderContainerClass() {
    return _compact([
      'hse-select-label-container',
      this.disablePlaceholder && (this.selected || this.nullText) ? 'disabled' : ''
    ])
      .join(' ');
  }

  /**
   * Получить css-классы для элемента списка
   * item - элемент списка
   */
  getItemClass(item: any) {
    if (!item) {
      return _compact(['menu-row', this.modelValue === null && 'selected'])
        .join(' ');
    }

    return _compact(['menu-row', this.selected && item[this.idField] === this.selected[this.idField] && 'selected'])
      .join(' ');
  }

  /**
   * callback на изменение тектса в инпуте
   */
  changeInputValue(searchInput: any) {
    if (this.selected && this.selected[this.nameField] !== searchInput) {
      this.selected = null;
      this.modelValue = null;
      this.onChange(this.modelValue);
    }

    this.filterCollection(searchInput);
  }

  filterCollection(substr: any) {
    return this.collection;
    // this.filteredCollection = _filter((item) => {
    //  return _lowerCase(item[this.nameField]).indexOf(_lowerCase(substr)) > -1;
    // })(this.collection);
  }
}
