import { Routes } from '@angular/router';
import { CreateTaskComponent } from './pages/create-task/create-task.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks/create', pathMatch: 'full' },
  { path: 'tasks/create', component: CreateTaskComponent },
];