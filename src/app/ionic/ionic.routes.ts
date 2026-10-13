import { Routes } from '@angular/router';
import { MobileTabsComponent } from './components/mobile-tabs/mobile-tabs.component';
import { MobileDashboardComponent } from './pages/mobile-dashboard/mobile-dashboard.component';
import { MobileProjectsComponent } from './pages/mobile-projects/mobile-projects.component';
import { MobileTasksComponent } from './pages/mobile-tasks/mobile-tasks.component';
import { MobileProfileComponent } from './pages/mobile-profile/mobile-profile.component';
import { authGuard } from '../guards/auth.guard';

// =============================================================================
// [IONIC - AVANZADA 3] RUTAS SEPARADAS DE LA APLICACIÓN MÓVIL
// Define la jerarquía de rutas para los componentes móviles de Ionic,
// protegidas por authGuard y encapsuladas bajo el contenedor MobileTabsComponent.
// =============================================================================
export const ionicRoutes: Routes = [
  {
    path: 'mobile',
    component: MobileTabsComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: MobileDashboardComponent },
      { path: 'projects', component: MobileProjectsComponent },
      { path: 'tasks', component: MobileTasksComponent },
      { path: 'profile', component: MobileProfileComponent }
    ]
  }
];
