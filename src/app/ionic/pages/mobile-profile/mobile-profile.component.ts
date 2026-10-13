import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// [IONIC - AVANZADA 3] Componentes de Ionic para pantalla de perfil móvil
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonButton,
  IonSelect,
  IonSelectOption
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  mailOutline,
  shieldCheckmarkOutline,
  colorPaletteOutline,
  logOutOutline,
  sparklesOutline
} from 'ionicons/icons';

import { AuthService } from '../../../services/auth.service';
import { ThemeService, AppTheme } from '../../../services/theme.service';

@Component({
  selector: 'app-mobile-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // [IONIC] Componentes registrados
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonButton,
    IonSelect,
    IonSelectOption
  ],
  templateUrl: './mobile-profile.component.html',
  styleUrls: ['./mobile-profile.component.css']
})
export class MobileProfileComponent {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);

  themes: { id: AppTheme; name: string }[] = [
    { id: 'light', name: 'Luz Minimal' },
    { id: 'dark', name: 'Oscuro Profundo' },
    { id: 'minimal', name: 'Editorial Blanco' },
    { id: 'cyberpunk', name: 'Cyberpunk Neón' },
    { id: 'ocean', name: 'Océano Cristal' },
    { id: 'sunset', name: 'Atardecer Dorado' },
    { id: 'forest', name: 'Bosque Esmeralda' },
    { id: 'crimson', name: 'Carmesí Nocturno' },
    { id: 'cute', name: 'Cute Kawaii' }
  ];

  constructor() {
    addIcons({
      personCircleOutline,
      mailOutline,
      shieldCheckmarkOutline,
      colorPaletteOutline,
      logOutOutline,
      sparklesOutline
    });
  }

  onThemeChange(event: any): void {
    const selected = event.detail.value as AppTheme;
    this.themeService.setTheme(selected);
  }

  cerrarSesion(): void {
    if (confirm('¿Cerrar sesión en la aplicación?')) {
      this.authService.logout();
    }
  }
}
