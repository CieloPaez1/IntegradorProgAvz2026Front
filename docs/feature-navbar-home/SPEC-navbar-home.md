# SPEC - Navbar, Home y Reportes

## Rama
`feature/navbar-home`

## Objetivo
Mejorar la experiencia principal de la aplicacion agregando una navegacion lateral mas clara, un navbar con busqueda util, un Home tipo dashboard y pantallas de reportes para consultar el avance general y por proyecto.

## Alcance
- Sidebar con secciones principales: Inicio, Proyectos, Tareas y Reportes.
- Navbar con buscador de proyectos y tareas.
- Home dividido en resumen de proyectos y resumen de tareas.
- Acciones rapidas para crear proyectos y tareas.
- Reporte general con avance global, horas, distribucion de estados y alertas.
- Reporte por proyecto con selector, tareas asociadas, avance y horas.
- Layout adaptable cuando el sidebar se colapsa.

## Requisitos funcionales
- El usuario puede buscar proyectos por nombre, descripcion o estado.
- El usuario puede buscar tareas por titulo, responsable, proyecto o estado.
- La busqueda debe aceptar estados en espanol, por ejemplo `hecho`, `por hacer`, `en progreso`, `activo`, `cerrado`.
- Los resultados de busqueda deben aparecer desde la primera letra y limitarse para no generar un dropdown demasiado largo.
- El Home debe mostrar:
  - total de proyectos
  - proyectos planificados, en proceso y terminados
  - porcentaje de proyectos terminados
  - total de tareas
  - tareas por hacer, en proceso y hechas
  - porcentaje de tareas hechas
  - ultimos proyectos y tareas
- El sidebar debe permitir colapsarse y el contenido principal debe ocupar el espacio liberado.
- Reportes debe incluir:
  - resumen general del trabajo
  - reporte por proyecto

## Requisitos no funcionales
- Mantener componentes standalone de Angular.
- Usar `environment.apiUrl` para URLs del backend.
- Evitar caracteres rotos en textos visibles.
- Mantener estilos responsivos para pantallas chicas.
- Usar iconos consistentes mediante Lucide.

## Archivos principales modificados
- `src/app/components/navbar/*`
- `src/app/components/sidebar/*`
- `src/app/pages/home/*`
- `src/app/pages/reports/*`
- `src/app/services/search.service.ts`
- `src/app/services/layout.service.ts`
- `src/app/services/project.service.ts`
- `src/app/services/task.service.ts`
- `src/app/app.routes.ts`
- `src/app/app.*`
- `src/app/models/task.model.ts`

## Criterios de aceptacion
- `npm.cmd run build` compila correctamente.
- El sidebar muestra iconos y textos sin duplicaciones visuales.
- Al colapsar el sidebar, el navbar y el contenido se expanden.
- El buscador muestra resultados automaticamente al escribir.
- Buscar `hecho` muestra tareas con estado `DONE`.
- El Home muestra dos paneles: Proyectos y Tareas.
- `/reports` muestra informacion distinta al Home, enfocada en reporte general.
- `/reports/project` permite seleccionar un proyecto y ver su avance.

## Verificacion realizada
Se ejecuto:

```bash
npm.cmd run build
```

Resultado: build exitoso. Permanece un warning de presupuesto del bundle inicial, no bloqueante.
