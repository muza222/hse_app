import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'hse-references-guides-dialog',
  templateUrl: './hse-references-guides-dialog.component.html',
  styleUrls: ['./hse-references-guides-dialog.component.scss']
})
export class HseReferencesGuidesDialogComponent implements OnInit {
  addDtForm: FormGroup;
  constructor(public dialog: MatDialog,
              private dialogRef: MatDialogRef<HseReferencesGuidesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit(): void {
    this.createForm();
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  sendDt() {
    const formValue = this.addDtForm.getRawValue();
    this.dialogRef.close(formValue);
  }
  private createForm() {
    this.addDtForm = new FormGroup({
      ru: new FormControl(this.data.el ? this.data.el.name.ru : null),
      en: new FormControl(this.data.el ? this.data.el.name.en : null),
    });
  }
}
