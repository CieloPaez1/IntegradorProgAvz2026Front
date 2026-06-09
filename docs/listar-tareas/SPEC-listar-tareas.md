# Feature: Listar Tareas

## Descripción general
El usuario puede visualizar todas las tareas registradas en el sistema a través de una tabla resumen. La tabla debe incluir información cruzada con el proyecto al que pertenece la tarea.

## Endpoints involucrados
- `GET /tasks`
  - 200: Lista de todas las tareas.
  - 400: Datos inválidos.
  - 404: Proyecto o tarea no encontrados.
  - 409: Conflicto de negocio.
  - 500: Error interno, mostrar cartel de error.
  - 0: Sin conexión, mostrar cartel de error "No se pudo conectar al servidor".
- `GET /projects`
  - 200: Lista de proyectos (usada para resolver el nombre visual del proyecto).
  - 500 / 0: Error que impide resolver nombres, se silencia o muestra error general.

## Restricciones de negocio
- Se deben mostrar los siguientes campos en la tabla: ID, Título, Nombre del Proyecto, Horas Estimadas, Asignado, y Estado.
- El estado debe traducirse visualmente (TODO -> POR HACER, IN_PROGRESS -> EN PROGRESO, DONE -> HECHO).
- Si no hay tareas en el sistema, se debe mostrar un mensaje amigable indicando que no hay tareas en lugar de una tabla vacía.
- Si falla la conexión con el servidor, debe mostrar un cartel de error.

## Lineamientos técnicos
- Standalone component con selector `app-task-list`
- Bootstrap 5 puro para estilos base más CSS personalizado para apariencia "Premium" (bordes redondeados, sombras, hover effects).
- HttpClient con servicio dedicado `TaskService` y `ProjectService`.
- Uso de `forkJoin` de RxJS para cargar concurrentemente proyectos y tareas antes de mostrar la UI.
- Uso de `Signals` de Angular 17 para el manejo reactivo del estado (`tasks`, `projects`, `loading`, `error`).
- Iconos utilizando `lucide-angular`.
- Se requiere que las llamadas HTTP usen `environment.apiUrl` puro, sin `console.error` en producción.

## Criterios de aceptación

- Dado que existen tareas y proyectos en la BD,
  cuando el usuario entra a la pantalla de "Gestión de Tareas",
  entonces ve una tabla con la lista completa de tareas con los nombres de proyecto resueltos.

- Dado que no hay tareas registradas,
  cuando el usuario entra a la pantalla,
  entonces ve el mensaje amigable "No hay tareas aún" en lugar de la tabla de datos.

- Dado que el servidor está apagado,
  cuando el usuario entra a la pantalla,
  entonces ve el mensaje de error "No se pudo conectar al servidor".

## Agente IA
Antigravity — prompts documentados en PROMPT-listar-tareas.md


> *Nota: Este documento de especificación y su respectivo código fueron generados íntegramente por **Antigravity** (Asistente de IA).*

