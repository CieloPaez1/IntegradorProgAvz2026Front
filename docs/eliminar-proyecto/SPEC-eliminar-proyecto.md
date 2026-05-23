# Feature: Eliminar Proyecto

## Descripción general
El usuario puede eliminar un proyecto existente desde la tabla de proyectos.
El sistema verifica en el backend que el proyecto no tenga tareas asociadas.
Si tiene tareas, muestra un mensaje de error. Si no tiene, elimina y actualiza la tabla.

## Endpoints involucrados
- `DELETE /projects/{projectId}`
  - Response 200: proyecto eliminado correctamente
  - Response 404: proyecto no encontrado
  - Response 409: el proyecto tiene tareas asociadas y no puede eliminarse

## Restricciones de negocio
- Solo se puede eliminar un proyecto si no tiene tareas asociadas
- Si el proyecto tiene tareas, el backend devuelve 409
- Si el proyecto no existe, el backend devuelve 404

## Lineamientos técnicos
- Standalone component
- Bootstrap 5 para estilos
- HttpClient con servicio dedicado `ProjectService`
- Signals para manejo de estado
- Persistencia local con localStorage (sincronizado al eliminar)
- Botón eliminar en cada fila de la tabla con confirmación antes de borrar

## Criterios de aceptación

- Dado que el proyecto no tiene tareas,
  cuando el usuario hace click en Eliminar y confirma,
  entonces el proyecto se elimina y desaparece de la tabla.

- Dado que el proyecto tiene tareas asociadas,
  cuando el usuario hace click en Eliminar,
  entonces ve el mensaje "No se puede eliminar un proyecto con tareas asociadas".

- Dado que el proyecto no existe,
  cuando se intenta eliminar,
  entonces ve el mensaje "Proyecto no encontrado".

- Dado que el usuario hace click en Eliminar,
  cuando aparece la confirmación,
  entonces puede cancelar y el proyecto no se elimina.

## Agente IA
Claude (claude.ai) — prompts documentados en prompt-eliminar-proyecto.md
