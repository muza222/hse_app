import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'hse-references-prerequisites-dialog',
  templateUrl: './hse-references-prerequisites-dialog.component.html',
  styleUrls: ['./hse-references-prerequisites-dialog.component.scss']
})
export class HseReferencesPrerequisitesDialogComponent implements OnInit {
  addPrerequisiteForm: FormGroup;
  constructor(public dialog: MatDialog,
              private dialogRef: MatDialogRef<HseReferencesPrerequisitesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.createForm();
  }
  closeDialog() {
    this.dialog.closeAll();
  }
  sendPrerequisite() {
    const formValue = this.addPrerequisiteForm.getRawValue();
    this.dialogRef.close(formValue);
  }
  private createForm() {
    this.addPrerequisiteForm = new FormGroup({
      ru: new FormControl(this.data.el ? this.data.el.name.ru : null),
      en: new FormControl(this.data.el ? this.data.el.name.en : null),
    });
  }
}
