# Feature: Crear Tarea dentro de un Proyecto

## Descripción general
El usuario puede crear una nueva tarea dentro de un proyecto existente.
El sistema verifica que el proyecto exista y no esté en estado CLOSED antes de crear la tarea.
Si la creación es exitosa, la tarea aparece en la tabla inferior.
Si hay error, muestra un mensaje descriptivo.

## Endpoints involucrados
- `POST /projects/{projectId}/tasks`
  - Body: `{ title, estimateHours, assignee, status }`
  - Response 201: TaskResponse
  - Response 400: validación fallida
  - Response 404: proyecto no encontrado
  - Response 409: el proyecto está CLOSED y no acepta nuevas tareas

## Restricciones de negocio
- `title` es obligatorio
- `estimateHours` debe ser mayor a 0
- `assignee` es opcional
- `status` debe ser TODO, IN_PROGRESS o DONE
- No se puede crear una tarea en un proyecto con estado CLOSED
- Si se crea una tarea con status DONE, el backend setea `finishedAt = now`

## Lineamientos técnicos
- Standalone component con selector `app-create-task`
- Bootstrap 5 para estilos
- Reactive Forms con validaciones
- HttpClient con servicio dedicado `TaskService` en `src/app/services/`
- Signals para manejo de estado: `loading`, `error`, `success`, `tasks`
- El dropdown de proyectos se carga dinámicamente desde la base de datos usando `ProjectService`

## Criterios de aceptación

- Dado que el usuario completa todos los campos válidos,
  cuando hace click en Guardar,
  entonces la tarea se crea y aparece en la tabla.

- Dado que el usuario deja el título vacío,
  cuando hace click en Guardar,
  entonces ve el mensaje "El título es obligatorio".

- Dado que el usuario ingresa estimateHours <= 0,
  cuando hace click en Guardar,
  entonces ve el mensaje "Las horas deben ser mayor a 0".

- Dado que el proyecto está CLOSED,
  cuando el usuario intenta crear una tarea,
  entonces ve el mensaje de error 409 del backend.

- Dado que el proyecto no existe,
  cuando se intenta crear la tarea,
  entonces ve el mensaje "Proyecto no encontrado".

- Dado que el backend no está disponible (sin conexión),
  cuando se intenta crear una tarea o cargar proyectos,
  entonces ve el mensaje de error indicando que no hay conexión.

## Agente IA
Antigravity — prompts documentados en prompt-crear-tarea.md

> *Nota: Este documento de especificación y su respectivo código fueron generados íntegramente por **Antigravity** (Asistente de IA).*

