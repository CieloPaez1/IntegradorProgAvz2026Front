import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// =============================================================================
// [IONIC - AVANZADA 3] IMPORTACIONES STANDALONE DE COMPONENTES MÓVILES
// En Ionic moderno para Angular Standalone, cada elemento web nativo de Ionic
// se importa de forma granular para optimizar el bundle (Tree-Shaking).
// =============================================================================
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/angular';

// [IONIC] addIcons registra los SVGs oficiales de Ionicons en memoria
import { addIcons } from 'ionicons';
import {
  gridOutline,
  folderOutline,
  checkboxOutline,
  personOutline,
  sparklesOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-mobile-tabs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // [IONIC] Componentes de Ionic registrados en la vista standalone:
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
  constructor() {
    // [IONIC] Registramos los iconos que se renderizan en cada pestaña inferior
    addIcons({
      gridOutline,
      folderOutline,
      checkboxOutline,
      personOutline,
      sparklesOutline
    });
  }
}
