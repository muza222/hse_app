import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferencesRoutingModule } from './references-routing.module';
import { HseReferencesTagsComponent } from './hse-references-tags/hse-references-tags.component';
import { HseReferencesPrerequisitesComponent } from './hse-references-prerequisites/hse-references-prerequisites.component';
import { HseReferencesHeaderComponent } from './hse-references-header/hse-references-header.component';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '@shared/shared.module';
import { MatSortModule } from '@angular/material/sort';
import { HseReferencesGuidesComponent } from './hse-references-guides/hse-references-guides.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HseReferencesGuidesDialogComponent } from './components/hse-references-guides-dialog/hse-references-guides-dialog.component';
import { HseReferencesTagsDialogComponent } from './components/hse-references-tags-dialog/hse-references-tags-dialog.component';
import {
  HseReferencesPrerequisitesDialogComponent
} from './components/hse-references-prerequisites-dialog/hse-references-prerequisites-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApplicationStatusComponent } from './components/application-status/application-status.component';


@NgModule({
  declarations: [
    HseReferencesTagsComponent,
    HseReferencesPrerequisitesComponent,
    HseReferencesHeaderComponent,
    HseReferencesGuidesComponent,
    HseReferencesGuidesDialogComponent,
    HseReferencesTagsDialogComponent,
    HseReferencesPrerequisitesDialogComponent,
    ApplicationStatusComponent
  ],
  exports: [
    HseReferencesHeaderComponent,
    ApplicationStatusComponent
  ],
  imports: [
    CommonModule,
    ReferencesRoutingModule,
    MatTableModule,
    SharedModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTooltipModule
  ]
})
export class ReferencesModule {
}
