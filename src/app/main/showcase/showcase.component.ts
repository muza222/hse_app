import { Component, OnInit } from '@angular/core';
import { SessionStoreService } from '@core/session-store/session-store.service';
import { Session } from '@core/session-store/session.interface';
import { StorageService } from '@core/backend/storage.service';
import { EppItem } from '@core/interfaces/epp-item.interface';
import { EppItemExtended } from '@core/interfaces/epp-item-extended';
import { MyEppDeleteDialogComponent } from '@shared/my-epp-delete-dialog/my-epp-delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EppFieldResponse } from '@core/backend/fields/epp-field-response';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss']
})
export class ShowcaseComponent implements OnInit {
  session: Session;
  eppList: EppFieldResponse[];
  constructor( public sessionStorage: SessionStoreService,
               public storageService: StorageService,
               private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadEpp();
  }

  async loadEpp() {
    // const res = await this.storageService.getEppList();
    this.eppList = this.storageService.getAvailableApplications();
    console.log(this.eppList.length);
  }

  async open(epp, eppItem) {
    const formDialog$ = this.dialog.open<MyEppDeleteDialogComponent, any>(
      MyEppDeleteDialogComponent, {
        data: {"name": eppItem.name, "desc": eppItem.description},
        autoFocus: 'first-heading'
      })
      .afterClosed();

    formDialog$.subscribe(async () => {
      alert('Заявка подана');
    });
  }
}
