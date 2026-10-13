import { Routes } from '@angular/router';
import { FilterTasksComponent } from './pages/filter-tasks/filter-tasks.component';
import { HomeComponent } from './pages/home/home.component';
import { ReportsSummaryComponent } from './pages/reports/reports-summary.component';
import { ProjectReportComponent } from './pages/reports/project-report.component';
import { ProjectDetailComponent } from './pages/projects/project-detail.component';
import { ProjectListComponent } from './pages/projects/list/project-list.component';
import { TaskDetailComponent } from './pages/tasks/task-detail.component';
import { TaskListComponent } from './pages/tasks/list/task-list.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { EditProjectComponent } from './pages/edit-project/edit-project.component';
import { DeleteProjectComponent } from './pages/delete-project/delete-project.component';
import { CreateTaskComponent } from './pages/create-task/create-task.component';
import { DeleteTaskComponent } from './pages/delete-task/delete-task.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { authGuard, guestGuard } from './guards/auth.guard';
// [IONIC - AVANZADA 3] Importación de rutas de la experiencia móvil
import { ionicRoutes } from './ionic/ionic.routes';

export const routes: Routes = [
  // Rutas públicas de autenticación
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },

  // Rutas privadas protegidas por AuthGuard
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'reports', component: ReportsSummaryComponent, canActivate: [authGuard] },
  { path: 'reports/project', component: ProjectReportComponent, canActivate: [authGuard] },
  { path: 'projects', component: ProjectListComponent, canActivate: [authGuard] },
  { path: 'projects/create', component: CreateProjectComponent, canActivate: [authGuard] },
  { path: 'projects/edit/:id', component: EditProjectComponent, canActivate: [authGuard] },
  { path: 'projects/delete', component: DeleteProjectComponent, canActivate: [authGuard] },
  { path: 'projects/:id', component: ProjectDetailComponent, canActivate: [authGuard] },
  { path: 'tasks/list', component: TaskListComponent, canActivate: [authGuard] },
  { path: 'tasks/create', component: CreateTaskComponent, canActivate: [authGuard] },
  { path: 'tasks/delete', component: DeleteTaskComponent, canActivate: [authGuard] },
  { path: 'projects/:projectId/tasks/edit/:taskId', component: EditTaskComponent, canActivate: [authGuard] },
  { path: 'tasks/:id', component: TaskDetailComponent, canActivate: [authGuard] },

  // =========================================================================
  // [IONIC - AVANZADA 3] Rutas separadas para la experiencia móvil con Ionic
  // =========================================================================
  ...ionicRoutes,

  { path: '**', redirectTo: 'home' }
];


