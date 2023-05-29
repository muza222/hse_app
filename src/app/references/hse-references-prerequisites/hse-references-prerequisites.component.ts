import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HseReferencesPrerequisitesDialogComponent } from '../components/hse-references-prerequisites-dialog/hse-references-prerequisites-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PrerequisiteService } from '@core/backend/dictionary/prerequisite/prerequisite.service';
import { sortFunction } from '@tools/localized-sort';
import { BaseEntity } from '@core/interfaces/base-entity.interface';
import { findIndex as _findIndex } from 'lodash/fp';
import _sort from '@tools/references-sort';
import _defaultSort from '@tools/default-references-sort';
import { ReferencesDeleteDialogComponent } from '@shared/references-delete-dialog/references-delete-dialog.component';
import { Router } from '@angular/router';
import { LocaleChoiceService } from '@core/locale-choice/locale-choice.service';

@Component({
  selector: 'hse-references-prerequisites',
  templateUrl: './hse-references-prerequisites.component.html',
  styleUrls: ['./hse-references-prerequisites.component.scss']
})

export class HseReferencesPrerequisitesComponent implements OnInit {
  prerequisitesList: BaseEntity[] = [];
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
              private prerequisiteService: PrerequisiteService,
              private dialog: MatDialog,
              public route: Router,
              private localeChoice: LocaleChoiceService) {
  }
  ngOnInit() {
    this.loadData();
    this.locale = this.localeChoice.getCurrentLocale().name;
  }

  async loadData() {
    this.prerequisitesList = await this.prerequisiteService.getList();
    this.dataSource = new MatTableDataSource<BaseEntity>(this.prerequisitesList);
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
    const formDialog$ = this.dialog.open<HseReferencesPrerequisitesDialogComponent, any>(
      HseReferencesPrerequisitesDialogComponent, {
        data: {words},
        autoFocus: 'first-heading'
      })
      .afterClosed();

    formDialog$.subscribe(async (formValue) => {
      if (formValue) {
        const formData: Partial<BaseEntity> = {
          name: formValue
        };
        const res = await this.prerequisiteService.createPrerequisite(formData);
        this.prerequisitesList.push(res);
        _sort(this, this.prerequisitesList);
      }
    });
  }
  async updateElement(el, words) {
    const formDialog$ = this.dialog.open<HseReferencesPrerequisitesDialogComponent, any>(
      HseReferencesPrerequisitesDialogComponent, {
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
        const res = await this.prerequisiteService.updatePrerequisite(formData);
        const elIdx = _findIndex({id: el.id})(this.prerequisitesList);
        this.prerequisitesList.splice(elIdx, 1, res);
        _sort(this, this.prerequisitesList);
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
        await this.prerequisiteService.removePrerequisite(id);
        this.prerequisitesList = this.prerequisitesList.filter(epp => epp.id !== id);
        this.dataSource = new MatTableDataSource<BaseEntity>(this.prerequisitesList);
        // this.dataSource.sortData = sortFunction;
        this.dataSource.sort = this.sort;
      }
    });
  }

  /*setDefaultSort() {
    this.dataSource.sortData = sortFunction;
    this.dataSource.sort = this.sort;
    const sortState: Sort = {active: `${this.locale}`, direction: 'asc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
  }*/

}
