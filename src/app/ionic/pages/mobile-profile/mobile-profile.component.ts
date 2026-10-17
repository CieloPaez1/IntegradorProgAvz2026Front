import { Component, inject, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// [IONIC 9 - CLASES 2 y 3] Componentes de Ionic para pantalla de perfil móvil
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
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
  IonSelectOption,
  IonToggle
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  mailOutline,
  shieldCheckmarkOutline,
  colorPaletteOutline,
  logOutOutline,
  sparklesOutline,
  moonOutline
} from 'ionicons/icons';

import { AuthService } from '../../../services/auth.service';
import { ThemeService, AppTheme } from '../../../services/theme.service';

@Component({
  selector: 'app-mobile-profile',
  standalone: true,
  imports: [
    UpperCasePipe,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
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
    IonSelectOption,
    IonToggle
  ],
  templateUrl: './mobile-profile.component.html',
  styleUrls: ['./mobile-profile.component.css']
})
export class MobileProfileComponent {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);

  isDarkMode = signal<boolean>(document.body.classList.contains('dark'));

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
      sparklesOutline,
      moonOutline
    });
  }

  // [CLASE 2 - EJERCICIO 10] Agregar un ion-toggle para alternar el modo oscuro
  toggleDarkMode(event: CustomEvent): void {
    const checked = (event as any).detail.checked;
    document.body.classList.toggle('dark', checked);
    this.isDarkMode.set(checked);
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
