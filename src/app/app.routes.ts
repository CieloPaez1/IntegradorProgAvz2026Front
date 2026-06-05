import { Routes } from '@angular/router';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { DeleteProjectComponent } from './pages/delete-project/delete-project.component';
import { CreateTaskComponent } from './pages/create-task/create-task.component';
import { DeleteTaskComponent } from './pages/delete-task/delete-task.component';

export const routes: Routes = [
  { path: '', redirectTo: 'projects/create', pathMatch: 'full' },
  { path: 'projects/create', component: CreateProjectComponent },
  { path: 'projects/delete', component: DeleteProjectComponent },
  { path: 'tasks/create', component: CreateTaskComponent },
  { path: 'tasks/delete', component: DeleteTaskComponent }
];