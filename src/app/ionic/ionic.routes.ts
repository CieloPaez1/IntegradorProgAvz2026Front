import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';

// =============================================================================
// [IONIC 9 - CLASE 3: LAZY LOADING CON loadComponent Y RUTAS HIJAS]
// Todas las pantallas móviles (Dashboard, Proyectos, Detalle de Proyecto,
// Crear/Editar Proyecto, Tareas, Crear/Editar Tarea y Perfil) se cargan
// perezosamente dentro del contenedor Ionic.
// =============================================================================
export const ionicRoutes: Routes = [
  {
    path: 'mobile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/mobile-tabs/mobile-tabs.component').then(m => m.MobileTabsComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/mobile-dashboard/mobile-dashboard.component').then(m => m.MobileDashboardComponent)
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/mobile-projects/mobile-projects.component').then(m => m.MobileProjectsComponent)
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./pages/mobile-project-detail/mobile-project-detail.component').then(m => m.MobileProjectDetailComponent)
      },
      {
        path: 'project-form',
        loadComponent: () =>
          import('./pages/mobile-project-form/mobile-project-form.component').then(m => m.MobileProjectFormComponent)
      },
      {
        path: 'project-form/:id',
        loadComponent: () =>
          import('./pages/mobile-project-form/mobile-project-form.component').then(m => m.MobileProjectFormComponent)
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/mobile-tasks/mobile-tasks.component').then(m => m.MobileTasksComponent)
      },
      {
        path: 'task-form',
        loadComponent: () =>
          import('./pages/mobile-task-form/mobile-task-form.component').then(m => m.MobileTaskFormComponent)
      },
      {
        path: 'task-form/:projectId/:taskId',
        loadComponent: () =>
          import('./pages/mobile-task-form/mobile-task-form.component').then(m => m.MobileTaskFormComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/mobile-profile/mobile-profile.component').then(m => m.MobileProfileComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
