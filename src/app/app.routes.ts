import { Routes } from '@angular/router';
import { CreateProjectComponent } from './pages/create-project/create-project.component'; // agregá .component
import { TaskListComponent } from './pages/tasks/list/task-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'projects/create', pathMatch: 'full' },
  { path: 'projects/create', component: CreateProjectComponent },
  { path: 'tasks/list', component: TaskListComponent }
];