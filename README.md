# GestorProyectos Corporativo (Web + App Híbrida Ionic 9)

Aplicación híbrida multiplataforma para la gestión integral de **Proyectos y Tareas por equipos**, con tableros de progreso, autenticación JWT real contra PostgreSQL, soporte offline y funcionalidades nativas móviles.

---

## Funcionalidades

### Pantallas y Features Principales (Navegación por `ion-tabs` + `ion-split-pane` / `ion-menu`)
1. **Autenticación (`/login` y `/register` — Clase Opcional B):**
   - Inicio de sesión y registro conectados a la tabla `users` en PostgreSQL mediante API REST en Spring Boot.
   - Protección de rutas privadas con `authGuard` (`CanActivateFn`) e inyección automática de `Authorization: Bearer <token>` con `authInterceptor` (`HttpInterceptorFn`) y cierre de sesión automático ante respuestas `401 Unauthorized`.
2. **Dashboard Móvil (`/mobile/dashboard` — Clases 2, 3, 5 y 6):**
   - Resumen ejecutivo de avance de proyectos y tareas con Signals (`computed`), `ion-card`, `ion-chip`, `ion-refresher` y `ion-fab`.
3. **Mis Proyectos (`/mobile/projects` — Clases 2, 5 y 6):**
   - Búsqueda reactiva en tiempo real con `ion-searchbar`, estados de carga (`ion-spinner`) y error (`ion-text`), y sincronización con caché local.
4. **Mis Tareas e Interacciones Avanzadas (`/mobile/tasks` — Clases 2, 6, 9 y 10):**
   - Filtro por estado con `ion-segment` (`ALL`, `TODO`, `IN_PROGRESS`, `DONE`).
   - **Pull-to-refresh (`ion-refresher`)** con llamada explícita a `event.target.complete()`.
   - **Swipe-to-delete / completar (`ion-item-sliding` + `ion-item-options`)** con diálogo de confirmación bloqueante mediante `AlertController`.
   - **Modal de Detalle (`ModalController`)** con transición de entrada personalizada a 60fps usando la **Animations API (`createAnimation()`)** sobre el Shadow DOM (`ion-backdrop` y `.modal-wrapper`).
5. **Formulario Reactivo de Nueva Tarea (`/mobile/task-form` — Clases 4, 8 y 9):**
   - Construido con `ReactiveFormsModule`, `FormBuilder`, `Validators`, getters tipados (`get title()`, `get estimateHours()`), `<ion-note color="danger">` al estar `touched && invalid`, y `markAllAsTouched()` al enviar.
6. **Mi Perfil y Tema Oscuro (`/mobile/profile` — Clases 2 y 3):**
   - Datos de sesión JWT, conmutador de Modo Oscuro (`body.dark` y variables CSS `--ion-color-*` con sus 4 variantes `-rgb`, `-contrast`, `-shade`, `-tint`) y botón de cierre de sesión.

### Plugins Nativos de Capacitor 8 Utilizados
- **`@capacitor/preferences` y `@capacitor/network` (Clase 6):** Persistencia local clave-valor con estrategia **Network-First y Fallback Offline** (`IonicStorageService`).
- **`@capacitor/camera` y `@capacitor/filesystem` (Clase 8):** Captura de foto con cámara o galería (`ActionSheetController`), almacenamiento persistente del binario en `Directory.Data`, renderizado seguro en el WebView mediante `Capacitor.convertFileSrc()` y separación de binario vs. metadatos (`task.photo`).
- **`@capacitor/geolocation` (Clase 9):** Solicitud explícita de permisos en tiempo de ejecución (`requestPermissions()`), captura de coordenadas GPS (`lat`, `lng`) al crear una tarea y apertura directa en Google Maps (`window.open(url, '_system')`).
- **`@capacitor/local-notifications` (Clase 9):** Programación de recordatorios locales en el dispositivo según la fecha de vencimiento (`LocalNotifications.schedule()`) y cancelación automática al completar la tarea (`LocalNotifications.cancel()`).

---

## Tecnologías

- **Frontend Móvil y Web:** Ionic 9 (`@ionic/angular`) · Angular 21 (Standalone Components, Signals, Control Flow `@if`/`@for`) · Capacitor 8 (`@capacitor/core`, `@capacitor/cli`).
- **Backend API REST:** Java 21 · Spring Boot 3.3 (Arquitectura Hexagonal: módulos `Core` y `Adapter`) · PostgreSQL.
- **Testing:** Vitest / Angular TestBed con `provideHttpClient()` + `provideHttpClientTesting()` (`HttpTestingController`).

---

## Requisitos

- **Node.js 22+** (`v22.16.0` verificado)
- **Java JDK 21+** y **PostgreSQL** (base de datos `integrador` en puerto `5432`)

---

## Instalación y ejecución

```bash
# 1. Instalar dependencias del frontend
npm.cmd install

# 2. Iniciar el Backend REST (Spring Boot en http://localhost:8080)
npm.cmd run back

# 3. Iniciar la aplicación en servidor de desarrollo Ionic (http://localhost:8100)
npm.cmd run ionic
```

### Ejecutar Tests Unitarios (Clase 12)
```bash
npm.cmd test -- --watch=false
```

---

## Build nativo (Clase 11)

> **Nota sobre Angular 17+ (`@angular/build:application`):** El builder moderno genera el `index.html` dentro de la subcarpeta `/browser`. Por eso en [`capacitor.config.ts`](./capacitor.config.ts) la propiedad `webDir` apunta a `'dist/IntegradorProgAvz2026Front/browser'`.

```bash
# 1. Compilar el proyecto web de producción
npm.cmd run build

# 2. Sincronizar assets web y plugins nativos con Android
npx cap sync android

# 3. Abrir en Android Studio para correr en emulador o generar APK de debug
npx cap open android
```

---

## Decisiones técnicas

1. **Convivencia Web + Móvil y Separación Pedagógica:** Todo el módulo móvil de Ionic 9 se organizó de forma modular bajo `src/app/ionic/` y `src/styles-ionic.css`, documentando cada bloque con comentarios `[IONIC 9 - CLASE X]` que explican los fundamentos teóricos de las Clases 1 a 12 y la Clase Opcional B.
2. **IonicRouteStrategy (`app.config.ts`):** Se registró `{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }` para preservar en memoria las páginas apiladas y habilitar las transiciones nativas de Ionic.
3. **Estrategia Offline-First / Network-First (`IonicStorageService`):** Cuando el dispositivo tiene red (`@capacitor/network`), consulta la API REST de Spring Boot y actualiza la caché en `@capacitor/preferences`. Si el servidor no responde o no hay conectividad, `catchError` recupera transparentemente la copia local sin romper la interfaz, garantizando que `finalize` apague siempre el `ion-spinner`.
4. **Separación de Binarios y Metadatos (Clase 8):** Las fotografías tomadas con `@capacitor/camera` se escriben como archivos físicos `.jpeg` dentro de `Directory.Data` (`@capacitor/filesystem`), mientras que en el modelo `Task` solo viaja el nombre del archivo (`task-<timestamp>.jpeg`) para no inflar el JSON de la API ni de Preferences.

---

## Autor/es

- **Cielo Páez** — Programación Avanzada 3 (Ingeniería / Licenciatura en Sistemas - UNdeC).
