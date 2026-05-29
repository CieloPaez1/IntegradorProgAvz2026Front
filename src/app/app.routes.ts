import { Routes } from '@angular/router';
import { DeleteProjectComponent } from './pages/delete-project/delete-project.component';

export const routes: Routes = [
  { path: '', redirectTo: 'projects/delete', pathMatch: 'full' },
  { path: 'projects/delete', component: DeleteProjectComponent },
];