import type { CapacitorConfig } from '@capacitor/cli';

// =============================================================================
// [CAPACITOR 8 - CLASE 1: LAS TRES CAPAS DEL PROYECTO HÍBRIDO]
// Concepto clave de cátedra: "Ionic es la cara (UI), Capacitor es el puente".
// Un proyecto Ionic + Capacitor se divide en tres capas que conviven:
//   1) Código Web (src/): Nuestra aplicación Angular Standalone + Ionic 9.
//   2) Configuración del Puente Nativo (este archivo capacitor.config.ts):
//      Indica el ID único de paquete (appId), el nombre de la app (appName)
//      y qué carpeta compilada (webDir) debe empaquetar dentro del WebView.
//   3) Proyectos Nativos Generados (android/, ios/): Generados con `npx cap add`.
// =============================================================================
const config: CapacitorConfig = {
  // Identificador único de la app en formato dominio inverso (usado por Android/iOS)
  appId: 'com.avanzada3.gestorproyectos',

  // Nombre visible de la aplicación en el teléfono
  appName: 'TaskGo - Gestor de Proyectos',

  // Carpeta donde Angular deposita el build de producción (`ng build`)
  webDir: 'dist/IntegradorProgAvz2026Front/browser',

  server: {
    // Permite esquema seguro en Android
    androidScheme: 'https'
  }
};

export default config;
