import { Routes } from '@angular/router';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';

export const routes: Routes = [
  { path: '', redirectTo: 'projects/1/tasks/edit/1', pathMatch: 'full' },
  { path: 'projects/:projectId/tasks/edit/:taskId', component: EditTaskComponent }
];