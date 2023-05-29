import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BaseEntity } from '@core/interfaces/base-entity.interface';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { EppService } from '@core/backend/handler/epp.service';
import { SideFiltersService } from '@shared/hse-side-filters/side-filters.service';
import { EppItemExtended } from '@core/interfaces/epp-item-extended';
import { StorageService } from '@core/backend/storage.service';
import { MyEppDeleteDialogComponent } from '@shared/my-epp-delete-dialog/my-epp-delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationStatusComponent } from '../../references/components/application-status/application-status.component';
import { EppStatus, UserType } from '@core/enums';
import { Router } from '@angular/router';
import { EppFieldResponse } from '@core/backend/fields/epp-field-response';
import { SessionStoreService } from '@core/session-store/session-store.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'all-applications',
  templateUrl: './all-applications.component.html',
  styleUrls: ['./all-applications.component.scss']
})

export class AllApplicationsComponent implements OnInit {
  allApplicationsList: [];
  eppList: EppFieldResponse[];
  displayedColumns: string[] = [
    'date',
    'type',
    'number',
    'executor',
    'applicant',
    'lastChanged',
    'status'
  ];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private liveAnnouncer: LiveAnnouncer,
              private dialog: MatDialog,
              private sideFilterService: SideFiltersService,
              public storageService: StorageService,
              private router: Router,
              public sessionStore: SessionStoreService) {
  }

  ngOnInit(): void {
    if (this.sessionStore.getSession().activeRole.name !== UserType.SUPERVISOR) {
      this.displayedColumns.splice(4, 1);
      console.log(this.displayedColumns);
    }
    this.loadEpp();
  }

  getRecord(row) {
    //alert(  'uwfhebweof');
    if (this.sessionStore.getSession().activeRole.name === UserType.SUPERVISOR) {
      this.router.navigate(['epp/123']);
    }
  }
  async loadEpp() {
    //const res = await this.storageService.getEppList();
    this.eppList = this.storageService.parseEpp(this.sessionStore.getSession().id, this.sessionStore.getSession().activeRole.name, []);
    this.dataSource = new MatTableDataSource<EppFieldResponse>(this.eppList);
    console.log(this.eppList.length);
  }

  async open(epp, eppItem) {
    const formDialog$ = this.dialog.open<MyEppDeleteDialogComponent, any>(
      MyEppDeleteDialogComponent, {
        data: {"name":"Справка об обучении", "desc": "Подтверждает факт обучения студента"},
        autoFocus: 'first-heading'
      })
      .afterClosed();

    formDialog$.subscribe(async (id) => {
      if (id) {
        // await this.eppService.deleteEpp(id);
        // this.router.navigate(['my-epp']);
      }
    });
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

  openFilters() {
    this.sideFilterService.toggleNavState();
  }

  removeElement() {
  }

  protected readonly EppStatus = EppStatus;
  protected readonly formatDate = formatDate;
  protected readonly UserType = UserType;
}
