import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ReportsSummaryComponent } from './pages/reports/reports-summary.component';
import { ProjectReportComponent } from './pages/reports/project-report.component';
import { ProjectDetailComponent } from './pages/projects/project-detail.component';
import { TaskDetailComponent } from './pages/tasks/task-detail.component';
import { TaskListComponent } from './pages/tasks/list/task-list.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { DeleteProjectComponent } from './pages/delete-project/delete-project.component';
import { CreateTaskComponent } from './pages/create-task/create-task.component';
import { DeleteTaskComponent } from './pages/delete-task/delete-task.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'reports', component: ReportsSummaryComponent },
  { path: 'reports/project', component: ProjectReportComponent },
  { path: 'projects/create', component: CreateProjectComponent },
  { path: 'projects/delete', component: DeleteProjectComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
  { path: 'tasks/list', component: TaskListComponent },
  { path: 'tasks/create', component: CreateTaskComponent },
  { path: 'tasks/delete', component: DeleteTaskComponent },
  { path: 'tasks/:id', component: TaskDetailComponent }
];
