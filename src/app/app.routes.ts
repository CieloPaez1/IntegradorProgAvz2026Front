import { Routes } from '@angular/router';
import { DeleteTaskComponent } from './pages/delete-task/delete-task.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks/delete', pathMatch: 'full' },
  { path: 'tasks/delete', component: DeleteTaskComponent },
];