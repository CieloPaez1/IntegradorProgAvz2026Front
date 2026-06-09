# Prompt: Feature Modificar Tarea

**Rol:** Desarrollador Frontend Angular 17+ Senior experto en Standalone Components, Reactive Forms y Signals.

**Contexto:** Estamos creando un gestor de proyectos. Necesito implementar la pantalla para modificar una tarea existente de un proyecto.

**Instrucciones paso a paso:**
1. Crea un modelo `Task` (`task.model.ts`) si no existe en la rama base.
2. Crea el servicio `TaskService` e implementa los métodos `getById(projectId: number, taskId: number)` y `update(projectId: number, taskId: number, task: Task)`. Usa `HttpClient` y `environment.apiUrl`. IMPORTANTE: en el `handleError` no utilices `console.error`.
3. Crea el componente standalone `EditTaskComponent` en `src/app/pages/edit-task/`.
4. En el `ngOnInit`, usa `ActivatedRoute` para capturar `projectId` y `taskId` de la ruta.
5. Llama a `TaskService.getById` para cargar los datos en un formulario reactivo (usando `patchValue`).
6. El formulario debe tener: Title (required, max 100), EstimateHours (min 1, required), Assignee (max 100), y Status (required).
7. Usa Signals para manejar los estados `loading` (para la carga inicial), `saving` (durante el PUT), `error` y `success`.
8. En el HTML, mientras `loading` sea true, muestra un spinner centrado.
9. El HTML debe contener campos estilizados con CSS custom para un diseño premium (bordes redondeados, focus con sombra).
10. Muestra alertas condicionales para `error()` o `success()`. 
11. Si la petición PUT (`onSubmit`) es exitosa, establece `success` a true, oculta el `saving`, y usa un `setTimeout` de 2000ms para redirigir mediante `Router` a `/tasks/list`.
12. Añade la ruta `{ path: 'projects/:projectId/tasks/edit/:taskId', component: EditTaskComponent }` en `app.routes.ts`.

**Diseño Premium:**
- Títulos llamativos y subtítulos grises descriptivos (`#6b7280`).
- Card contenedora con `border-radius: 24px` y sombras suaves.
- Botones modernos. El botón de Guardar debe tener un spinner al lado del texto cuando `saving()` sea true.

Por favor, genera el código del componente (TS, HTML, CSS) y los ajustes al servicio y rutas.


> *Nota: Este documento de especificación y su respectivo código fueron generados íntegramente por **Antigravity** (Asistente de IA).*

