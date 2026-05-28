import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ReportsSummaryComponent } from './pages/reports/reports-summary.component';
import { ProjectReportComponent } from './pages/reports/project-report.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'reports', component: ReportsSummaryComponent },
  { path: 'reports/project', component: ProjectReportComponent },
];
