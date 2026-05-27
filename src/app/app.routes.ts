import { Routes } from '@angular/router';
import { FilterTasksComponent } from './pages/filter-tasks/filter-tasks.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks/filter', pathMatch: 'full' },
  { path: 'tasks/filter', component: FilterTasksComponent },
];