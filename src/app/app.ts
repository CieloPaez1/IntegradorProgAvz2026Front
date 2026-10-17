import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LayoutService } from './services/layout.service';
import { AuthService } from './services/auth.service';
// [IONIC 9 - CLASE 3] IonApp e IonRouterOutlet para administrar la pila de navegación móvil
import { IonApp, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, IonApp, IonRouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('GestorProyectos');
  protected readonly layoutService = inject(LayoutService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // =========================================================================
  // [IONIC - AVANZADA 3] DETECCIÓN DE VISTA MÓVIL
  // Signal reactivo que detecta si la ruta activa pertenece a /mobile.
  // Cuando es true, desactiva el sidebar/navbar de PC para dar paso
  // al viewport nativo de Ionic con su propia navegación por pestañas.
  // =========================================================================
  readonly isMobileView = signal<boolean>(false);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.isMobileView.set(url.startsWith('/mobile'));
    });
  }
}


