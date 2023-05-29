import { Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {
  cloneDeep as _cloneDeep,
  filter as _filter,
  lowerCase as _lowerCase,
  toString as _toString,
  map as _map,
  uniqBy as _uniqBy
} from 'lodash/fp';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LocaleChoiceService } from '@core/locale-choice/locale-choice.service';
import { LocaleObject } from '@core/locale-choice/locale-object.interface';
import { Subject as RxSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'hse-multi-select',
  templateUrl: './hse-multi-select.component.html',
  styleUrls: ['./hse-multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HseMultiSelectComponent),
      multi: true
    }
  ]
})
export class HseMultiSelectComponent implements OnInit, OnChanges, ControlValueAccessor {
  lang: LocaleObject;
  searchValue = '';
  modelValue = '';
  filteredCollection: any[] = [];
  showOptionsList = false;
  collectionCopy: any[];

  searchValueChanged: RxSubject<string> = new RxSubject<string>();

  @Input() collection: any[] = [];
  @Input() disabled: boolean;
  @Input() idField?: string;
  @Input() nameField?: string;
  @Input() selectedNameField?: string;
  @Input() placeholder?: string;
  @Input() showSearchInput = true;
  @Input() dropdownClassName?: string;
  @Input() isMulti = true;
  @Input() code: string;
  @Input() isLazyCollection = false;
  @Input() showDepartment = false;

  @Output() menuToggle?: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() searchValueChange?: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('inputElement') input: ElementRef;
  @ViewChild('selectHeader') selectHeader: ElementRef;

  constructor(protected translate: TranslateService,
              public localeChoice: LocaleChoiceService) {}

  ngOnChanges(changes: SimpleChanges) {
    // Для лейзи коллекций запоминаем и восстанавливаем выбранные значения
    // чтобы при изменении коллекции не потерять их
    if (this.isLazyCollection && this.filteredCollection?.length > 0) {
      const checkedItems = _filter('checked')(this.filteredCollection);

      this.collection = _uniqBy('id')(checkedItems.concat(this.collection));

      this.collectionCopy = _cloneDeep(this.collection);

      if (this.isMulti) {
        this.checkItem();
      } else {
        this.checkSingleItem(checkedItems[0]);
      }
    }

    this.collectionCopy = _cloneDeep(this.collection);
    this.filteredCollection = this.collectionCopy;
    this.changeValue();
  }

  ngOnInit() {
    this.idField = this.idField || 'id';
    this.nameField = this.nameField || 'name';
    this.selectedNameField = this.selectedNameField || 'name';

    this.searchValueChanged.pipe(
      debounceTime(this.isLazyCollection ? 500 : 0),
      distinctUntilChanged()
    )
      .subscribe(newText => {
        this.changeInputValue(newText);
      });


    this.translate.get('MULTI_SELECT_AUTOCOMPLETE').subscribe((tr) => {
      this.placeholder = this.placeholder || tr.SELECT_ELEMENT;
    });
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

  optionListOpened() {
    this.showOptionsList = true;
    this.menuToggle.emit(this.showOptionsList);

    setTimeout(() => {
      if (this.input) {
        this.input.nativeElement.focus();
      }
    });
  }

  optionListClosed() {
    this.showOptionsList = false;
    this.selectHeader.nativeElement.style.zIndex = '';
    this.onTouched();
    this.menuToggle.emit(this.showOptionsList);
  }

  changeInputValue(value: any) {
    if (this.isLazyCollection && value.length > 1) {

      this.searchValueChange.emit(value);
      return;
    }

    this.filterCollection(value);
  }

  filterCollection(substr: string) {
    this.lang = this.localeChoice.getCurrentLocale();
    this.filteredCollection = _filter((item) => {
      return _lowerCase(item[this.nameField][this.lang.name]).indexOf(_lowerCase(substr)) > -1;
    })(this.collectionCopy);
  }

  writeValue(value: any) {
    this.modelValue = value;
    this.changeValue();
  }

  get checkedItems() {
    return _filter('checked')(this.collectionCopy);
  }

  get checkedItemIds() {
    return _map('id')(this.checkedItems);
  }

  get checkedItemsCount() {
    return this.checkedItems.length;
  }

  checkItem() {
    this.onChange(this.checkedItemIds.join(','));
  }

  checkSingleItem(item) {
    this.collectionCopy.map((cc) => {
      cc.checked = cc.id === item.id;
    });
    this.onChange(this.checkedItemIds.join(','));
  }

  uncheckItem(event: Event, item: any) {
    event.stopPropagation();
    event.preventDefault();
    item.checked = false;
    this.onChange(this.checkedItemIds.join(','));
    this.onTouched();
  }

  protected changeValue() {
    if (!this.modelValue) {
      return;
    }

    const ids = this.modelValue.split(',');

    this.collectionCopy.forEach((cc) => {
      cc.checked = ids.includes(_toString(cc[this.idField]));
    });
  }
}
