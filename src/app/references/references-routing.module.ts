import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HseReferencesPrerequisitesComponent } from './hse-references-prerequisites/hse-references-prerequisites.component';
import { HseReferencesTagsComponent } from './hse-references-tags/hse-references-tags.component';
import { HseReferencesComponent } from './hse-references/hse-references.component';
import { HseReferencesGuidesComponent } from './hse-references-guides/hse-references-guides.component';
import { ReferencesGuard } from './references.guard';
import { HseReferencesHeaderComponent } from './hse-references-header/hse-references-header.component';


const routes: Routes = [
  {
    path: 'references/main',
    component: HseReferencesComponent,
    children: [
      {
        path: '',
        component: HseReferencesHeaderComponent,
        outlet: 'header',
      },
      {
        path: 'tags',
        component: HseReferencesTagsComponent,
      },
      {
        path: 'prerequisites',
        component: HseReferencesPrerequisitesComponent,
      }
    ],
    canActivate: [ReferencesGuard]
  },
  {
    path: 'references/digital_tools',
    component: HseReferencesComponent,
    children: [
      {
        path: '',
        component: HseReferencesHeaderComponent,
        outlet: 'header',
      },
      {
        path: ':id',
        component: HseReferencesGuidesComponent,
      }
    ],
    canActivate: [ReferencesGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ReferencesRoutingModule {
}
