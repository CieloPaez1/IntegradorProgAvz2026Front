# Prompt Inicial: Listar Proyectos

**Objetivo:** Crear un componente standalone de Angular llamado `ProjectListComponent` que consuma el `ProjectService` para listar, eliminar y ofrecer enrutamiento de edición para la entidad Proyecto.

**Requerimientos Técnicos:**
1. **Angular 17+ y Control Flow:** Utilizar Signals (`projects`, `loading`, `error`) y el nuevo sistema de renderizado (`@if`, `@for`).
2. **Componente Standalone:** Configurar los imports (`CommonModule`, `RouterModule` y componentes SVG de `@lucide/angular`).
3. **Integración con Servicios:** Invocar `getAll()` en el `ngOnInit`.
4. **Lógica de Eliminación:** El método `eliminarProyecto(id)` debe solicitar confirmación mediante `confirm()`. Si es exitoso, actualizar la `signal` removiendo el proyecto localmente sin tener que recargar desde el servidor entero.

**Requerimientos Visuales y UI/UX:**
1. **Layout Premium:** Usar CSS puro y moderno (sin Tailwind ni Bootstrap). Configurar una tabla limpia `table-responsive` dentro de una tarjeta con bordes suaves (`border-radius: 16px`) y sombras sutiles.
2. **Badges:** Los estados de los proyectos ("PLANNED", "ACTIVE", "CLOSED") deben renderizarse como etiquetas visuales (*badges*) de colores respectivos.
3. **Botones de Acción Prominentes:** La última columna "Acciones" debe contener un botón para "Editar" y otro para "Eliminar". 
   - El botón Editar debe usar el color índigo (`#4f46e5`) con un fondo permanente azul claro.
   - El botón Eliminar debe usar color rojo (`#ef4444`) con un fondo permanente rojo claro.
   - Deben tener transición de escala y sombra en el hover.
4. **Manejo de Errores y Estados Vacíos:** Si no hay datos, mostrar un *empty state* centrado con un ícono gigante (`LucideFolderKanban`) y un enlace persuasivo para invitar al usuario a crear el primer registro.
