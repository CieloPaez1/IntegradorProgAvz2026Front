import { Routes } from '@angular/router';
import { TaskListComponent } from './pages/tasks/list/task-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks/list', pathMatch: 'full' },
  { path: 'tasks/list', component: TaskListComponent }
];