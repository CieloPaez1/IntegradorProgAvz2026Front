# Prompt 01 - Contexto de la rama `feature/navbar-home`

## Pedido inicial
Corregir y mejorar el codigo del frontend Angular, especialmente navbar, buscador, Home, sidebar y reportes.

## Evolucion del pedido
1. Corregir errores de compilacion y servicios.
2. Mejorar el buscador del navbar.
3. Permitir buscar tareas por estados escritos en espanol, como `hecho`.
4. Hacer que la busqueda responda desde la primera letra y no muestre una lista demasiado larga.
5. Redisenar el Home con dos bloques: Proyectos y Tareas.
6. Agregar acciones rapidas con `+`.
7. Pensar una estructura mejor para el sidebar.
8. Agregar Reportes:
   - resumen general
   - reporte por proyecto
9. Reemplazar letras del sidebar por iconos.
10. Hacer que el navbar y el Home se expandan cuando se colapsa el sidebar.

## Decisiones tomadas
- Se uso `environment.apiUrl` como base para servicios HTTP.
- Se agrego `SearchService` para buscar proyectos y tareas.
- Se agrego ranking simple de resultados para priorizar coincidencias por nombre/titulo.
- Se normalizan tildes y mayusculas para mejorar busquedas.
- Se agrego `LayoutService` para compartir el estado colapsado del sidebar con el layout principal.
- Se uso Lucide para iconos del sidebar.
- Se agregaron pantallas standalone para reportes.

## Prompts utiles para continuar

### Mejorar estados desde listados
Quiero agregar cambio rapido de estado para proyectos y tareas desde sus listados o detalles. Usar selects con los estados existentes y actualizar mediante PUT al backend. Mantener el estilo visual actual.

### Crear pantallas de listado
Quiero crear pantallas `/projects/list` y `/tasks/list` con tabla, buscador, filtros por estado y acciones de editar/eliminar. Usar los servicios existentes y mantener el estilo del Home.

### Crear edicion de proyectos y tareas
Quiero agregar paginas para editar proyectos y tareas, incluyendo cambio de estado. Agregar metodos `update` en los servicios si faltan.

### Mejorar reportes
Quiero mejorar `/reports/project` con agrupacion de tareas por estado, barra de avance por horas y opcion para exportar o imprimir el reporte.

## Comando de validacion

```bash
npm.cmd run build
```
