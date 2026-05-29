import { Routes } from '@angular/router';
import { CreateProjectComponent } from './pages/create-project/create-project.component'; // agregá .component
import { ProjectListComponent } from './pages/projects/list/project-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'projects/list', pathMatch: 'full' },
  { path: 'projects/list', component: ProjectListComponent },
  { path: 'projects/create', component: CreateProjectComponent },
  { path: 'projects/edit/:id', component: CreateProjectComponent },
];