# Feature: Autenticación de Usuarios (Login y Registro con JWT)

## Descripción general
El sistema provee un mecanismo de autenticación para que los usuarios puedan registrarse, iniciar sesión con credenciales seguras (email y contraseña), mantener su sesión persistente mediante un token JWT y cerrar sesión. Las rutas privadas de la aplicación quedan protegidas por un Route Guard y las peticiones al backend llevan el token en el header HTTP Authorization.

## Endpoints involucrados
- `POST /auth/login`
  - Body: `{ email: string, password: string }`
  - Response 200: `{ token: string, user: { id: number, name: string, email: string, role: string } }`
  - Response 400: Datos incompletos o formato de email inválido.
  - Response 401: Credenciales inválidas (email o contraseña incorrecta).
- `POST /auth/register`
  - Body: `{ name: string, email: string, password: string }`
  - Response 201: `{ token: string, user: { id: number, name: string, email: string, role: string } }`
  - Response 400: Datos inválidos.
  - Response 409: El email ya se encuentra registrado.

## Restricciones de negocio
- El email debe tener un formato válido de correo electrónico.
- La contraseña debe contener al menos 6 caracteres.
- Las rutas privadas (`/home`, `/projects`, `/tasks`, `/reports`) solo son accesibles si el usuario cuenta con un token de autenticación válido en el cliente.
- Si un usuario no autenticado intenta acceder a una ruta protegida, el sistema debe redirigirlo automáticamente a `/login`.
- Si el usuario ya está autenticado e intenta navegar a `/login` o `/register`, se le debe redirigir a `/home`.
- El token y la información del usuario deben almacenarse de forma persistente en `localStorage`.
- El usuario puede cerrar sesión en cualquier momento desde el menú del Navbar, destruyendo el token y volviendo a `/login`.

## Lineamientos técnicos
- Standalone Components: `LoginComponent` y `RegisterComponent`.
- Formularios reactivos (`ReactiveFormsModule`, `FormBuilder`, `Validators`).
- Manejo de estado de sesión con **Signals** en `AuthService` (`currentUser`, `token`, `isAuthenticated`).
- Interceptor funcional `authInterceptor` para adjuntar `Authorization: Bearer <token>` en todas las solicitudes salientes a la API.
- Guard funcional `authGuard` implementando `CanActivateFn`.
- Manejo adaptativo: en caso de que el backend no tenga aún implementado el endpoint `/auth`, el servicio debe proveer un fallback controlado con credenciales de prueba (`admin@proyectos.com` / `admin123`) para asegurar la verificación manual en el frontend sin bloqueos.

## Criterios de aceptación
- **Dado** que un usuario no autenticado intenta ingresar a `/home` o `/projects`,
  **cuando** la ruta es interceptada por `authGuard`,
  **entonces** es redirigido a `/login`.

- **Dado** que el usuario ingresa credenciales válidas en el formulario de login,
  **cuando** presiona el botón "Iniciar Sesión",
  **entonces** el token se guarda en `localStorage`, `currentUser` se actualiza y es redirigido a `/home`.

- **Dado** que el usuario ingresa un email inválido o una contraseña menor a 6 caracteres,
  **cuando** interactúa con el formulario,
  **entonces** se muestran mensajes de validación en tiempo real y el botón de enviar se deshabilita.

- **Dado** que el usuario presiona "Cerrar Sesión" desde el menú de usuario del Navbar,
  **cuando** confirma la acción,
  **entonces** se limpia el almacenamiento local, se reinician los signals y se redirige a `/login`.

- **Dado** que un usuario nuevo completa el formulario de registro con datos válidos,
  **cuando** envía el formulario,
  **entonces** su cuenta se crea, se inicia su sesión automáticamente y se le redirige al dashboard.

## Agente IA
Antigravity potenciado por Gemini 3.8 Flash (High) — prompts documentados en PROMPT-auth-login.md

> *Nota: Este documento de especificación y su respectivo código fueron generados íntegramente por **Antigravity** (Asistente de IA).*
