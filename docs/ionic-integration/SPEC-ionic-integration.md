# Feature: Integración de Ionic Framework (Avanzada 3 - Mobile UI)

## Descripción general
Esta feature incorpora **Ionic Framework** (`@ionic/angular`) al proyecto Angular 21 existente para dotar a la aplicación de capacidades móviles híbridas (Cross-Platform / PWA). Toda la implementación de Ionic se desarrolla de forma modular y separada en la carpeta `src/app/ionic/`, manteniendo la compatibilidad con los servicios y modelos existentes de Avanzada 2 y 3, pero ofreciendo una experiencia nativa de celular con navegación por Tabs, barras de herramientas móviles, gestos táctiles (Pull-to-Refresh) y botones flotantes (FAB).

## Componentes y Librerías involucradas
- `@ionic/angular/standalone`: Componentes móviles en modo Standalone sin dependencias de módulos.
- `ionicons`: Iconografía nativa estándar de aplicaciones móviles.
- `provideIonicAngular()`: Proveedor de inicialización en `app.config.ts`.
- `styles-ionic.css`: Estilos base de estructura, temas y utilidades de Ionic aislados en su propio archivo.

## Restricciones y Decisiones de Diseño
- **Aislamiento y separación:** Toda la capa visual de Ionic se ubica en la carpeta dedicada `src/app/ionic/` para no alterar ni romper los componentes web previos de escritorio.
- **Didáctica y comentarios:** Cada archivo generado debe incluir comentarios detallados de código (`// [IONIC]`) explicando el propósito técnico de cada etiqueta y directiva.
- **Consumo de servicios compartidos:** Los componentes móviles consumen los mismos servicios (`AuthService`, `ProjectService`, `TaskService`), garantizando la reutilización de la lógica de negocio y el token JWT.
- **Gestos y patrones móviles:**
  - Barra de pestañas inferior (`ion-tabs`, `ion-tab-bar`) para navegación con una sola mano.
  - Pull-to-refresh (`ion-refresher`): Gesto de deslizar hacia abajo para recargar datos en tiempo real.
  - Floating Action Button (`ion-fab`): Botón circular flotante para acciones rápidas (crear proyecto o tarea).
  - Tarjetas móviles (`ion-card`, `ion-card-header`, `ion-card-content`): Presentación visual optimizada para pantallas pequeñas.

## Lineamientos técnicos
- Angular 21 Standalone Components importando componentes específicos de `@ionic/angular/standalone` (`IonContent`, `IonHeader`, `IonToolbar`, `IonTitle`, `IonCard`, `IonRefresher`, `IonRefresherContent`, etc.).
- Modo de renderizado configurable (`md` para Material Design / Android o `ios` para Apple).
- Rutas móviles dedicadas en `src/app/ionic/ionic.routes.ts`.

## Criterios de aceptación
- **Dado** que un usuario accede a la vista móvil,
  **cuando** navega a la sección de Ionic,
  **entonces** ve una interfaz con encabezado nativo (`ion-header`), tarjetas redondeadas (`ion-card`) y barra de navegación inferior (`ion-tab-bar`).

- **Dado** que el usuario se encuentra en el listado móvil y desliza la pantalla hacia abajo,
  **cuando** se activa el evento `ionRefresh`,
  **entonces** se vuelven a solicitar los proyectos y tareas a la API y el indicador spinner móvil se apaga al completarse.

- **Dado** que el usuario hace clic en el botón flotante (`ion-fab`),
  **cuando** presiona el icono de acción rápida,
  **entonces** se despliega el menú contextual de creación móvil.

## Agente IA
Antigravity potenciado por Gemini 3.8 Flash (High) — prompts documentados en PROMPT-ionic-integration.md

> *Nota: Este documento de especificación y su respectivo código fueron generados íntegramente por **Antigravity** (Asistente de IA).*
