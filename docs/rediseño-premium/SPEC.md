# Rediseño Premium y Selector de Temas Dinámico

## Descripción de la Feature
Se solicita un rediseño completo de la interfaz gráfica ("Estilo Stripe/Framer"), abandonando el estilo "bootstrap" básico y adoptando una estética premium con degradados animados (mesh gradients), tipografía enorme, sombras de cristal y contenedores flotantes. Además, se incluye la implementación de un Selector de Temas con múltiples opciones de color (Claro, Oscuro, Minimalista, Cyberpunk, Océano, Atardecer, Bosque).

## Requisitos y Criterios de Aceptación
1. **Mesh Gradients**: 
   - El fondo de la aplicación debe estar compuesto por manchas de color dinámicas, fluidas y animadas que giran sutilmente (`float1`, `float2`, `float3`).
2. **Tipografía y Tipografía Gigante**:
   - Reemplazar la fuente por defecto a 'Inter'.
   - Aplicar tamaños de fuente enormes (hasta `3.5rem`) con peso `Extrabold` (800/900) en la pantalla de bienvenida.
3. **Rediseño de Listas y Tablas**:
   - Eliminar todas las tablas (`<table>`) en la creación de Proyectos y Tareas.
   - Reemplazarlas por "Filas Flotantes" (`.floating-row`), tarjetas redondeadas (`border-radius: 20px`) con efectos de `hover` avanzados (escalado y desplazamiento Y).
4. **Selector de Temas Múltiple**:
   - Refactorizar `ThemeService` para que persista y manipule múltiples temas mediante `strings` (en lugar de solo Dark/Light).
   - Crear un menú desplegable moderno (`.theme-dropdown`) en el componente `Navbar`.
   - Incorporar 7 paletas de colores distintas aplicadas mediante atributos CSS `[data-theme="..."]`.
5. **Persistencia**:
   - El tema elegido por el usuario debe persistir en recargas utilizando el `localStorage`.
