import { Routes } from '@angular/router';
import { CreateProjectComponent } from './pages/create-project/create-project.component'; // agregá .component

export const routes: Routes = [
  { path: '', redirectTo: 'projects/create', pathMatch: 'full' },
  { path: 'projects/create', component: CreateProjectComponent },
];