import { Routes } from '@angular/router';

import { ListComponent } from './components/list/list.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: ListComponent },
  { path: 'list', component: ListComponent }
];
