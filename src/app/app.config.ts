import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
// [IONIC - AVANZADA 3] Importación del proveedor oficial de Ionic
import { provideIonicAngular } from '@ionic/angular';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    
    // =========================================================================
    // [IONIC FRAMEWORK - AVANZADA 3]
    // provideIonicAngular inicializa el runtime móvil de Ionic:
    // - Configura el modo visual (mode: 'md' para Material Design / Android)
    // - Habilita controladores de animaciones táctiles, Overlays (Alerts, Toasts)
    // - Prepara el soporte para navegación móvil nativa e híbrida
    // =========================================================================
    provideIonicAngular({
      mode: 'md'
    })
  ]
};
