import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HseHeaderComponent } from './hse-header/hse-header.component';
import { HseFooterComponent } from './hse-footer/hse-footer.component';
import { HseIconComponent } from './components/ui/hse-icon/hse-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { IsAuthDirective } from '@shared/directives/is-auth.directive';
import { HsePaginationComponent } from './hse-pagination/hse-pagination.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HseSelectComponent } from './hse-select/hse-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocalizedStringPipe } from '@shared/pipes/localized-string.pipe';
import { HseInputComponent } from '@shared/components/ui/hse-input/hse-input.component';
import { NgxMaskModule } from 'ngx-mask';
import { TableScrollDirective } from './directives/table-scroll.directive';
import { HseMultiSelectComponent } from '@shared/components/ui/hse-multi-select/hse-multi-select.component';
import { HseDashedButtonComponent } from '@shared/components/ui/hse-dashed-button/hse-dashed-button.component';
import { HseCheckboxComponent } from '@shared/components/ui/hse-checkbox/hse-checkbox.component';
import { HseTextareaComponent } from './components/ui/hse-textarea/hse-textarea.component';
import { HseSlideToggleComponent } from './components/ui/hse-slide-toggle/hse-slide-toggle.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AutoHeightDirective } from '@shared/directives/autoheight.directive';
import { HseFileUploadComponent } from './components/ui/hse-file-upload/hse-file-upload.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HseRadioButtonComponent } from '@shared/components/ui/hse-radio-button/hse-radio-button.component';
import { HseDatePickerComponent } from '@shared/components/ui/hse-date-picker/hse-date-picker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterLinkWithHref } from '@angular/router';
import { HseSideFiltersComponent } from './hse-side-filters/hse-side-filters.component';
import { MyEppDeleteDialogComponent } from './my-epp-delete-dialog/my-epp-delete-dialog.component';
import { ReferencesDeleteDialogComponent } from './references-delete-dialog/references-delete-dialog.component';

const declarations = [
    HseHeaderComponent,
    HseFooterComponent,
    HseIconComponent,
    IsAuthDirective,
    HsePaginationComponent,
    HseSelectComponent,
    LocalizedStringPipe,
    HseInputComponent,
    TableScrollDirective,
    HseMultiSelectComponent,
    HseDashedButtonComponent,
    HseCheckboxComponent,
    HseTextareaComponent,
    HseSlideToggleComponent,
    AutoHeightDirective,
    HseRadioButtonComponent,
    HseDatePickerComponent,
    HseFileUploadComponent,
    HseSideFiltersComponent,
    MyEppDeleteDialogComponent,
    ReferencesDeleteDialogComponent,
];

@NgModule({
    declarations: [
        ...declarations,
    ],
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        MatMenuModule,
        MatButtonModule,
        MatTooltipModule,
        FormsModule,
        NgxMaskModule.forRoot(),
        MatSlideToggleModule,
        MatProgressBarModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        RouterLinkWithHref
    ],
    exports: [
        TranslateModule,
        ...declarations,
    ]
})
export class SharedModule {
}
