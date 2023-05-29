import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowcaseComponent } from './showcase/showcase.component';
import { EppComponent } from './epp/epp.component';
import { AllApplicationsComponent } from './all-applications/all-applications.component';

const routes: Routes = [
  {
    path: '',
    component: ShowcaseComponent
  },
  {
    path: 'epp/create',
    component: EppComponent
  },
  {
    path: 'epp/:id',
    component: EppComponent
  },
  {
    path: 'all-applications',
    component: AllApplicationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
