import { Routes } from '@angular/router';
import { EditProjectComponent } from './pages/edit-project/edit-project.component';

export const routes: Routes = [
  { path: '', redirectTo: 'projects/edit/1', pathMatch: 'full' },
  { path: 'projects/edit/:id', component: EditProjectComponent }
];