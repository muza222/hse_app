import { Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop as _noop } from 'lodash/fp';
import { HseAlertService } from '@core/hse-alert/hse-alert.service';

@Component({
  selector: 'hse-file-upload',
  templateUrl: './hse-file-upload.component.html',
  styleUrls: ['./hse-file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HseFileUploadComponent),
      multi: true
    }
  ]
})
export class HseFileUploadComponent implements ControlValueAccessor, OnChanges {

  @Input() requiredFileType: string;
  @Input() code: string;
  @Input() disabled = false;
  @Input() fileName;
  @Output() uploadFile: EventEmitter<{}> = new EventEmitter<{}>();
  @Output() deleteFile: EventEmitter<{}> = new EventEmitter<{}>();

  onChange: any = _noop;
  onTouched: any = _noop;
  model: any;


  fileNameInner = '';
  uploadProgress: number;

  constructor(private alertService: HseAlertService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    const name = changes['fileName'].currentValue;
    if (name) {
      this.fileNameInner = decodeURIComponent(name);
    }
  }

  onFileSelected(event) {
    const file: File = event.target.files[0];
    const fiveMB = 5242880;
    if (file) {
      if (file.size < fiveMB) {
        this.fileNameInner = file.name;
        this.uploadFile.emit({file, code: this.code});
      }
      else {
        this.alertService.info(`Размер файла не соответствует требованияим. Размер вашего файла ${this.formatBytes(file.size)}`);
      }
    }
  }

  formatBytes(bytes, decimals = 2) {
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  cancelUpload() {
    this.deleteFile.emit(this.code);
    this.reset();
  }

  reset() {
    this.fileNameInner = '';
    this.uploadProgress = null;
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

}
