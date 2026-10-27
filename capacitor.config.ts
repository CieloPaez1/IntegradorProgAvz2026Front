import type { CapacitorConfig } from '@capacitor/cli';

// =============================================================================
// [CAPACITOR 8 - CLASE 1 Y CLASE 11: LAS TRES CAPAS Y BUILD NATIVO]
// Marco Teórico de Cátedra:
// - Clase 1 ("Ionic es la cara, Capacitor es el puente"):
//   1) Código Web (src/): Aplicación Angular Standalone + Ionic 9.
//   2) Configuración del Puente Nativo (capacitor.config.ts): Define appId,
//      appName y webDir.
//   3) Proyectos Nativos Generados (android/, ios/): Creados con `npx cap add`.
//
// - Clase 11 (Del código web al APK — El pipeline mental):
//   (1) `npm run build` -> Angular compila src/ y produce HTML/CSS/JS optimizados.
//   (2) `npx cap sync`  -> Capacitor copia el build al proyecto nativo y actualiza
//                          los plugins nativos (@capacitor/camera, geolocation, etc.).
//   (3) Android Studio / Xcode -> Compilan el WebView + archivos web + plugins en
//                          un .apk/.aab (Android) o .ipa (iOS).
//
// - Clase 11 (Atención con Angular 17+ / Angular 21 application builder):
//   El builder moderno `@angular/build:application` deposita el `index.html`
//   dentro de la subcarpeta `/browser`. Por eso `webDir` debe apuntar a la
//   subcarpeta `/browser` para evitar el error:
//   "The web assets directory must contain an index.html file".
//
// - Novedades de Capacitor 8 (Clase 11):
//   * Edge-to-edge en Android (plugin interno SystemBars; Ionic respeta
//     automáticamente --ion-safe-area-top / --ion-safe-area-bottom).
//   * iOS con Swift Package Manager (SPM) en lugar de CocoaPods (sin `pod install`).
//   * Node 22+ obligatorio.
// =============================================================================
const config: CapacitorConfig = {
  // Identificador único de paquete en formato dominio inverso (tiendas Google Play / App Store)
  appId: 'com.undec.gestorproyectos',

  // Nombre visible de la aplicación en el dispositivo móvil
  appName: 'GestorProyectos TaskGo',

  // [CLASE 11] Contrato entre Angular 17+ (application builder) y Capacitor:
  // apunta exactamente a la carpeta donde queda el index.html compilado.
  webDir: 'dist/IntegradorProgAvz2026Front/browser',

  server: {
    // Permite esquema seguro en el WebView de Android
    androidScheme: 'https'
  }
};

export default config;
