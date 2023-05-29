import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'references-delete-dialog',
  templateUrl: './references-delete-dialog.component.html',
  styleUrls: ['./references-delete-dialog.component.scss']
})
export class ReferencesDeleteDialogComponent implements OnInit {

  urlName: string;
  displayingWords: string;
  constructor(public dialog: MatDialog,
              private dialogRef: MatDialogRef<ReferencesDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.urlName = this.data.route.url;
    this.writeDisplayingWords(this.urlName);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  confirmDelete(id) {
    this.dialogRef.close(id);
  }

  writeDisplayingWords(url) {
    switch (url) {
      case '/references/main/tags':
        this.displayingWords = 'DELETE.TAG';
        break;
      case '/references/main/prerequisites':
        this.displayingWords = 'DELETE.PREREQUISITE';
        break;
      case '/references/digital_tools/usage_area':
        this.displayingWords = 'DELETE.USAGE_AREA';
        break;
      case '/references/digital_tools/methods':
        this.displayingWords = 'DELETE.METHOD';
        break;
      case '/references/digital_tools/programs':
        this.displayingWords = 'DELETE.PROGRAM';
        break;
      case '/references/digital_tools/program_languages':
        this.displayingWords = 'DELETE.PROGRAM_LANGUAGE';
        break;
      case '/references/digital_tools/python_libraries':
        this.displayingWords = 'DELETE.PYTHON_LIBRARY';
        break;
      case '/references/digital_tools/data_tools':
        this.displayingWords = 'DELETE.DATA_TOOL';
        break;
    }
  }
}
