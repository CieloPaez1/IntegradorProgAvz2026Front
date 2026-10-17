import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// =============================================================================
// [IONIC 9 - CLASE 3: NAVEGACIÓN MÓVIL (TABS + MENÚ LATERAL + SPLIT PANE)]
// Marco Teórico de Cátedra:
// Tres patrones de navegación móvil y cuándo usar cada uno:
// 1. ion-tabs (Pestañas inferiores): Para 2-5 secciones principales de igual
//    jerarquía a las que el usuario salta seguido (Inicio, Proyectos, Tareas, Perfil).
// 2. ion-menu (Menú lateral / Drawer): Para acciones secundarias o ajustes
//    (modo oscuro, nueva tarea rápida, volver a web, cerrar sesión).
// 3. ion-split-pane (Pieza responsive): En teléfono el menú se oculta y abre
//    con gesto táctil o botón hamburguesa; en tablet/desktop queda fijo al costado.
// 4. MenuController: Servicio inyectable para abrir/cerrar el menú por código.
// =============================================================================
import {
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonToggle,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  MenuController
} from '@ionic/angular';

// [CLASE 2] addIcons registra únicamente los íconos usados (Tree-Shaking)
import { addIcons } from 'ionicons';
import {
  gridOutline,
  folderOutline,
  checkboxOutline,
  personOutline,
  addCircleOutline,
  moonOutline,
  desktopOutline,
  logOutOutline
} from 'ionicons/icons';

import { AuthService } from '../../../services/auth.service';
import { IonicStorageService } from '../../services/ionic-storage.service';

@Component({
  selector: 'app-mobile-tabs',
  standalone: true,
  imports: [
    RouterModule,
    // [IONIC 9] Componentes standalone de navegación y menú lateral
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonToggle,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
  ],
  templateUrl: './mobile-tabs.component.html',
  styleUrls: ['./mobile-tabs.component.css']
})
export class MobileTabsComponent {
  // [CLASE 3] Inyección de MenuController para controlar el menú programáticamente
  private menu = inject(MenuController);
  private router = inject(Router);
  readonly authService = inject(AuthService);
  readonly storageService = inject(IonicStorageService);

  isDarkMode = signal<boolean>(document.body.classList.contains('dark'));

  constructor() {
    addIcons({
      gridOutline,
      folderOutline,
      checkboxOutline,
      personOutline,
      addCircleOutline,
      moonOutline,
      desktopOutline,
      logOutOutline
    });
  }

  // ===========================================================================
  // [CLASE 2 - EJERCICIO 10] ALTERNAR MODO OSCURO MANUAL CON ion-toggle
  // Conmuta la clase 'dark' sobre document.body según el estado del toggle.
  // ===========================================================================
  toggleDarkMode(event: CustomEvent): void {
    const checked = (event as any).detail.checked;
    document.body.classList.toggle('dark', checked);
    this.isDarkMode.set(checked);
  }

  async navegarDesdeMenu(ruta: string): Promise<void> {
    await this.menu.close();
    this.router.navigate([ruta]);
  }

  async cerrarSesion(): Promise<void> {
    await this.menu.close();
    this.authService.logout();
  }
}
