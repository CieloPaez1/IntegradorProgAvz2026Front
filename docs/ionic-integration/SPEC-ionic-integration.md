# Feature: Integración de Ionic 9 + Angular Standalone + Capacitor 8 (Clases 1 a 6)

## Descripción general
Esta feature transforma la aplicación en una **App Móvil Híbrida** siguiendo los lineamientos del curso *"Ionic 9 + Angular (Standalone) — Capacitor 8"*. Toda la implementación móvil está aislada en `src/app/ionic/`, `src/styles-ionic.css` y `capacitor.config.ts` para diferenciarse claramente de la base web previa y mantener comentarios didácticos (`// [IONIC 9 - CLASE X]`) en cada archivo.

## Arquitectura de las Tres Capas (Clase 1)
1. **Capa 1 — Código Web (`src/app/ionic/`):** Componentes Angular Standalone importando selectivamente desde `@ionic/angular`.
2. **Capa 2 — Configuración del Puente Nativo (`capacitor.config.ts`):** Define `appId`, `appName` y `webDir` para empaquetar el WebView.
3. **Capa 3 — Proyectos Nativos (`android/` / `ios/`):** Generables mediante Capacitor CLI (`npx cap add android`).

## Conceptos de Cátedra Implementados (Clases 1 a 6)
- **Clase 1 (Fundamentos):** Separación de responsabilidades (*"Ionic es la cara, Capacitor es el puente"*), arquitectura de 3 capas y componentes standalone.
- **Clase 2 (UI, Web Components y Theming):**
  - Importación selectiva (*tree-shaking*) de `IonHeader`, `IonToolbar`, `IonList`, `IonItem`, `IonCheckbox`, `IonBadge`, `IonFab`, `IonFabButton`, e íconos con `addIcons()`.
  - Variables CSS con sus 4 parientes obligatorios (`--ion-color-primary`, `-rgb`, `-contrast`, `-shade`, `-tint`) y modo oscuro manual (`body.dark`) activado con `<ion-toggle>` (`toggleDarkMode`).
  - Sintaxis moderna de Angular 18–22 (`@if`, `@for (...; track ...)`).
- **Clase 3 (Navegación Móvil):**
  - Rutas standalone con **Lazy Loading** usando `loadComponent: () => import(...).then(...)` en `src/app/ionic/ionic.routes.ts`.
  - Combinación de los 3 patrones de navegación: `ion-tabs` (pestañas inferiores), `ion-menu` + `ion-split-pane` + `MenuController` (menú lateral responsive) e `IonRouterOutlet` + `IonicRouteStrategy`.
- **Clase 4 (Formularios Reactivos con Controles de Ionic):**
  - `MobileTaskFormComponent` (`/mobile/task-form`) con `ReactiveFormsModule`, `FormBuilder`, `Validators`, getters tipados (`get title()`), `markAllAsTouched()` y controles `ControlValueAccessor` nativos (`ion-input`, `ion-select`, `ion-datetime presentation="date"`, `ion-toggle`, `ion-note color="danger"`).
- **Clase 5 (Servicios, HttpClient y Estados de UI):**
  - Registro de `{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }` en `app.config.ts`.
  - Manejo de los 3 estados de petición con Signals (`tasks`, `loading`, `error`), operadores RxJS `catchError` + `finalize` y feedback visual con `<ion-spinner>` e `<ion-text color="danger">`.
- **Clase 6 (Persistencia Local y Estrategia Offline con Capacitor):**
  - `IonicStorageService` (`src/app/ionic/services/ionic-storage.service.ts`) integrando `@capacitor/preferences` (`Preferences.set` / `Preferences.get` con `JSON.stringify` / `JSON.parse`) y `@capacitor/network` (`Network.getStatus()`).
  - Estrategia **Network-First con Fallback Offline**: intenta consultar la API REST y guarda copia en disco; si falla la red o está sin conexión, recupera las últimas tareas y proyectos desde `Preferences`.

## Criterios de aceptación
- **Dado** que el usuario navega a `/mobile`,
  **cuando** se carga el layout móvil con `loadComponent`,
  **entonces** visualiza las pestañas inferiores (`ion-tabs`), el botón hamburguesa (`ion-menu-button`) y el menú lateral (`ion-menu` + `ion-split-pane`).

- **Dado** que el usuario activa el `ion-toggle` de Modo Oscuro en el menú lateral o en Perfil,
  **cuando** se dispara `toggleDarkMode`,
  **entonces** se alterna la clase `body.dark` aplicando las variables oscuras de Ionic.

- **Dado** que el usuario toca el botón flotante `+` (`ion-fab-button`) en la pantalla de Tareas,
  **cuando** accede a `/mobile/task-form` e intenta enviar el formulario con el título vacío,
  **entonces** `markAllAsTouched()` activa el `<ion-note color="danger">` accesible debajo del `<ion-input>`.

- **Dado** que el servidor backend está apagado o no hay conexión de red (`@capacitor/network`),
  **cuando** el usuario abre o refresca el listado móvil de tareas o proyectos,
  **entonces** `catchError` + `IonicStorageService` cargan automáticamente los últimos datos persistidos en `@capacitor/preferences` y `finalize` apaga el `ion-spinner`.
