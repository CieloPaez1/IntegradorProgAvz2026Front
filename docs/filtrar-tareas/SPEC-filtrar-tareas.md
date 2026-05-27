# Feature: Filtrar Tareas

## Descripción general
El usuario puede buscar tareas filtrando por horas mínimas estimadas y/o asignado.
El sistema envía los parámetros al backend y muestra los resultados en una tabla.
Si no hay resultados, muestra un mensaje indicándolo.

## Endpoints involucrados
- `GET /tasks?minEstimate=8&assignee=alice`
  - Parámetros opcionales: `minEstimate` (Integer), `assignee` (String)
  - Response 200: lista de TaskResponse
  - Si no se envían parámetros devuelve todas las tareas

## Restricciones de negocio
- Ambos parámetros son opcionales
- Si se envía `minEstimate` debe ser mayor a 0
- Se pueden combinar ambos filtros

## Lineamientos técnicos
- Standalone component con selector `app-filter-tasks`
- Bootstrap 5 para estilos
- Reactive Forms para el formulario de filtros
- HttpClient con servicio dedicado `TaskService`
- Signals para manejo de estado: `loading`, `error`, `tasks`

## Criterios de aceptación

- Dado que el usuario ingresa minEstimate=8,
  cuando hace click en Buscar,
  entonces ve solo las tareas con estimateHours >= 8.

- Dado que el usuario ingresa assignee=alice,
  cuando hace click en Buscar,
  entonces ve solo las tareas asignadas a alice.

- Dado que el usuario combina ambos filtros,
  cuando hace click en Buscar,
  entonces ve las tareas que cumplen ambas condiciones.

- Dado que no hay tareas que coincidan,
  cuando hace click en Buscar,
  entonces ve el mensaje "No hay tareas que coincidan con los filtros".

- Dado que el usuario no ingresa ningún filtro,
  cuando hace click en Buscar,
  entonces ve todas las tareas.

## Agente IA
Claude (claude.ai) — prompts documentados en prompt-filtrar-tareas.md