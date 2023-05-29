import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TagService } from '@core/backend/dictionary/tag/tag.service';
import { MatDialog } from '@angular/material/dialog';
import { HseReferencesTagsDialogComponent } from '../components/hse-references-tags-dialog/hse-references-tags-dialog.component';
import { sortFunction } from '@tools/localized-sort';
import { BaseEntity } from '@core/interfaces/base-entity.interface';
import { findIndex as _findIndex } from 'lodash/fp';
import _sort from '@tools/references-sort';
import { ReferencesDeleteDialogComponent } from '@shared/references-delete-dialog/references-delete-dialog.component';
import { Router } from '@angular/router';
import { LocaleChoiceService } from '@core/locale-choice/locale-choice.service';
import _defaultSort from '@tools/default-references-sort';


@Component({
  selector: 'hse-references-tags',
  templateUrl: './hse-references-tags.component.html',
  styleUrls: ['./hse-references-tags.component.scss']
})

export class HseReferencesTagsComponent implements OnInit {
  tagsList: BaseEntity[] = [];
  displayedColumns: string[] = ['ru', 'en', 'actions'];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  createWords = {
    header: 'Добавление',
    button: 'Добавить'
  };
  updateWords = {
    header: 'Редактирование',
    button: 'Редактировать'
  };
  locale: string;
  constructor(private liveAnnouncer: LiveAnnouncer,
              private tagService: TagService,
              private dialog: MatDialog,
              public route: Router,
              private localeChoice: LocaleChoiceService) {
  }
  ngOnInit() {
    this.loadData();
    this.locale = this.localeChoice.getCurrentLocale().name;
  }

  async loadData() {
    this.tagsList = await this.tagService.getList();
    this.dataSource = new MatTableDataSource<BaseEntity>(this.tagsList);
    _defaultSort(this);
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  addElement(words) {
    const formDialog$ = this.dialog.open<HseReferencesTagsDialogComponent, any>(
      HseReferencesTagsDialogComponent, {
        data: {words},
        autoFocus: 'first-heading'
      })
      .afterClosed();

    formDialog$.subscribe(async (formValue) => {
      if (formValue) {
        const formData: Partial<BaseEntity> = {
          name: formValue
        };
        const res = await this.tagService.createTag(formData);
        this.tagsList.push(res);
        _sort(this, this.tagsList);
      }
    });
  }
  async updateElement(el, words) {
    const formDialog$ = this.dialog.open<HseReferencesTagsDialogComponent, any>(
      HseReferencesTagsDialogComponent, {
        data: {el, words},
        autoFocus: 'first-heading'
      })
      .afterClosed();

    formDialog$.subscribe(async (formValue) => {
      if (formValue) {
        const formData: Partial<BaseEntity> = {
          id: el.id,
          name: formValue
        };
        const res = await this.tagService.updateTag(formData);
        const elIdx = _findIndex({id: el.id})(this.tagsList);
        this.tagsList.splice(elIdx, 1, res);
        _sort(this, this.tagsList);
      }
    });
  }

  removeElement(route, element) {
    const formDialog$ = this.dialog.open<ReferencesDeleteDialogComponent, any>(
      ReferencesDeleteDialogComponent, {
        data: {route, element},
        autoFocus: 'first-heading'
      })
      .afterClosed();

    formDialog$.subscribe(async (id) => {
      if (id) {
        await this.tagService.removeTag(id);
        this.tagsList = this.tagsList.filter(epp => epp.id !== id);
        this.dataSource = new MatTableDataSource<BaseEntity>(this.tagsList);
        // this.dataSource.sortData = sortFunction;
        this.dataSource.sort = this.sort;
      }
    });
  }
}
