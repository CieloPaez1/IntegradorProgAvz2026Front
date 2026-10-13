# Prompt: Feature Integración de Ionic Framework (Avanzada 3 - Mobile UI)

**Rol:** Eres un desarrollador Senior en Angular 21 y especialista en Ionic Framework (v8+) para aplicaciones móviles híbridas y PWAs.

**Contexto del sistema:**
Tenemos una aplicación SPA de gestión de proyectos y tareas construida en Angular 21 (Avanzada 2). Para la materia "Programación Avanzada 3", se solicita integrar Ionic Framework. Requerimos que esta integración esté completamente separada del código de escritorio anterior (en una carpeta dedicada `src/app/ionic/`) y que contenga comentarios pedagógicos exhaustivos (`// [IONIC]`) para que un estudiante pueda defender cada línea en una presentación oral.

**Feature a implementar:** Integración Modular de Ionic Framework
Considere los requerimientos de `SPEC-ionic-integration.md`:
1. Configuración global:
   - Proveer `provideIonicAngular()` en `app.config.ts`.
   - Crear `src/styles-ionic.css` con las hojas de estilo esenciales de `@ionic/angular/css/` comentadas paso a paso.
2. Componentes y Páginas Móviles en `src/app/ionic/`:
   - `MobileDashboardComponent` en `src/app/ionic/pages/mobile-dashboard/`:
     - Utiliza `IonHeader`, `IonToolbar`, `IonTitle`, `IonContent`, `IonCard`, `IonBadge`, `IonChip`, `IonRefresher`, `IonFab`.
     - Integra gestos móviles: Pull-to-refresh para recargar datos de `ProjectService` y `TaskService`.
     - Botón flotante FAB para creación rápida.
   - `MobileTabsComponent` en `src/app/ionic/components/mobile-tabs/`:
     - Utiliza `IonTabs`, `IonTabBar`, `IonTabButton`, `IonIcon`, `IonLabel`.
     - Permite navegación entre Dashboard, Proyectos, Tareas y Perfil.
3. Rutas en `src/app/ionic/ionic.routes.ts`:
   - Exponer las rutas móviles bajo el prefijo `/mobile` para permitir probar la experiencia móvil de forma independiente.
4. Comentarios de código:
   - Cada componente debe explicar qué hace cada directiva de Ionic (ej. `IonContent` controla el scroll nativo, `IonRefresher` provee el gesto táctil, etc.).

**Generar:** Configuración de estilos, app config, componentes móviles comentados y enrutamiento móvil.

> *Nota: Este documento de especificación y su respectivo código fueron generados íntegramente por **Antigravity** (Asistente de IA).*
