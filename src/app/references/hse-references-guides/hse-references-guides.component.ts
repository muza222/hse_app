import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HseReferencesGuidesDialogComponent } from '../components/hse-references-guides-dialog/hse-references-guides-dialog.component';
import { BaseEntity } from '@core/interfaces/base-entity.interface';
import { sortFunction } from '@tools/localized-sort';
import { ActivatedRoute, Router } from '@angular/router';
import { findIndex as _findIndex } from 'lodash/fp';
import { DtService } from '@core/backend/dictionary/dt/dt.service';
import _sort from '@tools/references-sort';
import { ReferencesDeleteDialogComponent } from '@shared/references-delete-dialog/references-delete-dialog.component';
import { LocaleChoiceService } from '@core/locale-choice/locale-choice.service';
import _defaultSort from '@tools/default-references-sort';

@Component({
  selector: 'hse-references-guides',
  templateUrl: './hse-references-guides.component.html',
  styleUrls: ['./hse-references-guides.component.scss']
})

export class HseReferencesGuidesComponent implements OnInit {
  dtRefList: BaseEntity[] = [];
  displayedColumns: string[] = ['ru', 'en', 'actions'];
  dataSource;
  id: number; // id захардкожено из енума в hse-references-header
  key: string;
  createWords = {
    header: 'Добавление',
    button: 'Добавить'
  };
  updateWords = {
    header: 'Редактирование',
    button: 'Редактировать'
  };
  /*deleteWords = {
    header: 'Редактирование',
    button: 'Удалить'
  };*/
  locale: string;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private liveAnnouncer: LiveAnnouncer,
              private dtService: DtService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              public routerPath: Router,
              private changeDetectorRefs: ChangeDetectorRef,
              private localeChoice: LocaleChoiceService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(url => {
      this.key = url.get('id');
      this.loadData(this.key);
    });
    this.locale = this.localeChoice.getCurrentLocale().name;
  }

  async loadData(key) {
    switch (key) {
      case 'usage_area':
        this.dtRefList = await this.dtService.getUsageAreaList();
        this.id = 0;
        break;
      case 'methods':
        this.dtRefList = await this.dtService.getMethodList();
        this.id = 1;
        break;
      case 'programs':
        this.dtRefList = await this.dtService.getProgramList();
        this.id = 2;
        break;
      case 'program_languages':
        this.dtRefList = await this.dtService.getProgramLanguageList();
        this.id = 3;
        break;
      case 'python_libraries':
        this.dtRefList = await this.dtService.getPythonLibList();
        this.id = 4;
        break;
      case 'data_tools':
        this.dtRefList = await this.dtService.getDataToolList();
        this.id = 5;
        break;
    }
    this.dataSource = new MatTableDataSource<BaseEntity>(this.dtRefList);
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

  addElement(id, words) {
    const formDialog$ = this.dialog.open<HseReferencesGuidesDialogComponent, any>(
      HseReferencesGuidesDialogComponent, {
        data: {key: this.key, words},
        autoFocus: 'first-heading'
      })
      .afterClosed();

    formDialog$.subscribe(async (formValue) => {
      if (formValue) {
        const formData: Partial<BaseEntity> = {
          name: formValue
        };
        const res = await this.dtService.createDt(formData, id);
        this.dtRefList.push(res);
        _sort(this, this.dtRefList);
      }
    });
  }

  async updateElement(el, words) {
    const formDialog$ = this.dialog.open<HseReferencesGuidesDialogComponent, any>(
      HseReferencesGuidesDialogComponent, {
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
        const res = await this.dtService.updateDt(formData);
        const elIdx = _findIndex({id: el.id})(this.dtRefList);
        this.dtRefList.splice(elIdx, 1, res);
        _sort(this, this.dtRefList);
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
        await this.dtService.removeDt(id);
        this.dtRefList = this.dtRefList.filter(epp => epp.id !== id);
        this.dataSource = new MatTableDataSource<BaseEntity>(this.dtRefList);
        // this.dataSource.sortData = sortFunction;
        this.dataSource.sort = this.sort;
      }
    });
  }
}
