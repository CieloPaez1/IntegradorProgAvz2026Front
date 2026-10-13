# Prompt: Feature Autenticación de Usuarios (Login y Registro con JWT)

**Rol:** Eres un desarrollador Senior en Angular 21 especializado en arquitectura de seguridad, formulación reactiva y patrones de autenticación JWT modernos para aplicaciones web y móviles.

**Contexto del sistema:**
Estamos desarrollando el frontend de un gestor de proyectos y tareas conectado a una API REST (Java Spring Boot). La aplicación utiliza Angular 21 con Standalone Components, Signals y diseño modular sin NgModules. Requerimos implementar el flujo completo de autenticación: Login, Registro, persistencia de sesión con JWT, Route Guard y HttpInterceptor.

**Feature a implementar:** Autenticación de Usuarios (Login y Registro)
Considere detalladamente el documento `SPEC-auth-login.md`:
- Modelos: `User` (`id`, `name`, `email`, `role`) y `AuthResponse` (`token`, `user`).
- Servicio `AuthService`:
  - Signals para `currentUser`, `token`, `isAuthenticated`.
  - Métodos `login(credentials)`, `register(data)`, `logout()`.
  - Persistencia de token y datos de usuario en `localStorage`.
  - Fallback/demo controlado en caso de indisponibilidad temporal del endpoint en el backend.
- Guardian de rutas `authGuard`:
  - `CanActivateFn` funcional para redirigir a `/login` si no está autenticado.
- Interceptor `authInterceptor`:
  - `HttpInterceptorFn` para adjuntar `Authorization: Bearer <token>`.
- Componentes Standalone:
  - `LoginComponent` en `src/app/pages/auth/login/`
  - `RegisterComponent` en `src/app/pages/auth/register/`
  - Formularios reactivos (`ReactiveFormsModule`) con validaciones de email y longitud de contraseña.
  - Diseño adaptable que combine con la estética premium de la aplicación.
- Actualización de navegación:
  - Proteger rutas privadas en `app.routes.ts`.
  - Integrar datos de usuario y acción de logout en `NavbarComponent`.

**Restricciones técnicas:**
- Usar Angular Standalone Components y `inject()`.
- Usar Signals para el estado reactivo de sesión.
- Manejar adecuadamente estados de carga (`loading`) y error (`error`).
- No usar `console.error` en código de producción.

**Generar:** Modelos, servicio, guard, interceptor, componentes de login y registro, y configuración de rutas.

> *Nota: Este documento de especificación y su respectivo código fueron generados íntegramente por **Antigravity** (Asistente de IA).*
