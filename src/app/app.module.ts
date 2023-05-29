import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from '@core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShowcaseComponent } from './main/showcase/showcase.component';
import { LeftMenuModule } from '@shared/modules/left-menu/left-menu.module';
import { TranslateModule } from '@ngx-translate/core';
import { AppLoadService } from './app-load.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EppComponent } from './main/epp/epp.component';
import { MatTabsModule } from '@angular/material/tabs';
import { HseReferencesComponent } from './references/hse-references/hse-references.component';
import { CookieModule } from 'ngx-cookie';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';
import { LoaderInterceptor } from '@core/interceptors/loader.interceptor';
import { ReferencesModule } from './references/references.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AllApplicationsComponent } from './main/all-applications/all-applications.component';
import { NgOptimizedImage } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    AppComponent,
    ShowcaseComponent,
    EppComponent,
    HseReferencesComponent,
    AllApplicationsComponent,
  ],
    imports: [
        BrowserModule,
        CookieModule.withOptions(),
        AppRoutingModule,
        CoreModule,
        LeftMenuModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        SharedModule,
        MatSlideToggleModule,
        MatTableModule,
        MatSortModule,
        MatTooltipModule,
        MatTabsModule,
        ReferencesModule,
        ReactiveFormsModule,
        NgOptimizedImage,
        MatPaginatorModule
    ],
  providers: [
    AppLoadService,
    {
      provide: APP_INITIALIZER,
      useFactory: (appLoader: AppLoadService) => {
        return () => appLoader.initApp();
      },
      deps: [AppLoadService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
