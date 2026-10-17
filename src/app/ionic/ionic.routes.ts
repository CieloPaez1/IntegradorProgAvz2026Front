import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';

// =============================================================================
// [IONIC 9 - CLASE 3: LAZY LOADING CON loadComponent Y RUTAS HIJAS]
// Marco Teórico de Cátedra:
// - En Angular Standalone, las rutas se definen con `loadComponent: () => import(...)`
//   en lugar del viejo `loadChildren` + NgModule. El import() dinámico le indica
//   al empaquetador que separe cada pantalla en un chunk independiente que se
//   descarga recién cuando el usuario navega hacia esa pestaña.
// - Rutas padre e hijas: La ruta padre ('mobile') carga el "cascarón"
//   (MobileTabsComponent con el menú lateral e ion-tabs) y cada ruta hija
//   carga el contenido de su pestaña correspondiente.
// - pathMatch: 'full' en la redirección vacía evita redirecciones infinitas.
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
        path: 'profile',
        loadComponent: () =>
          import('./pages/mobile-profile/mobile-profile.component').then(m => m.MobileProfileComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
