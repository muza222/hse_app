import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'hse-references-tags-dialog',
  templateUrl: './hse-references-tags-dialog.component.html',
  styleUrls: ['./hse-references-tags-dialog.component.scss']
})
export class HseReferencesTagsDialogComponent implements OnInit {
  addTagForm: FormGroup;

  constructor(public dialog: MatDialog,
              private dialogRef: MatDialogRef<HseReferencesTagsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit(): void {
    this.createForm();
  }
  closeDialog() {
    this.dialogRef.close();
  }
  sendTag() {
    const formValue = this.addTagForm.getRawValue();
    this.dialogRef.close(formValue);
  }
  private createForm() {
    this.addTagForm = new FormGroup({
      ru: new FormControl(this.data.el ? this.data.el.name.ru : null),
      en: new FormControl(this.data.el ? this.data.el.name.en : null),
    });
  }
}
