import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'my-epp-delete-dialog',
  templateUrl: './my-epp-delete-dialog.component.html',
  styleUrls: ['./my-epp-delete-dialog.component.scss']
})
export class MyEppDeleteDialogComponent implements OnInit {

  constructor(public dialog: MatDialog,
              private dialogRef: MatDialogRef<MyEppDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  confirmDelete(id) {
    this.dialogRef.close();
  }

}
