# Frontend — Gestión de Proyectos y Tareas

Frontend Angular para la aplicación de gestión de proyectos y tareas.
Proyecto integrador de Programación Avanzada II — Ciclo Lectivo 2026.

## Descripción
Aplicación web desarrollada con Angular que consume la API REST del backend
de gestión de proyectos y tareas desarrollado en la cursada anterior.
Permite crear, eliminar y filtrar proyectos y tareas a través de una interfaz moderna.

## Tecnologías
- Angular 19 (standalone components)
- Bootstrap 5
- Reactive Forms
- Signals
- HttpClient

## Requisitos previos
- Node.js 18+
- Angular CLI
- Backend corriendo en `http://localhost:8080`

## Instalación

```bash
npm install
```

## Correr en desarrollo

```bash
ng serve --port 4200
```

Navegar a `http://localhost:4200`

## Repositorio Backend
[IntegradorProgAvz2026](https://github.com/CieloPaez1/IntegradorProgAvz2026)

## Estructura del proyecto
src/app/
├── components/     # componentes reutilizables
├── models/         # interfaces y tipos del dominio
├── pages/          # páginas por feature
└── services/       # servicios HTTP

## Features implementadas

| Feature | Rama  |
|---|---|
| Crear Proyecto | feature/crear-proyecto |
| Eliminar Proyecto | feature/eliminar-proyecto |
| Crear Tarea | feature/crear-tarea |
| Eliminar Tarea | feature/eliminar-tarea |
| Filtrar Tareas | feature/filtrar-tareas |
| Editar Proyecto | feature/editar-proyecto |
| Editar Tarea | feature/editar-tarea |
| Dashboard Principal | feature/dashboard |
| Búsqueda Global | feature/busqueda-global |
| Sistema de Temas | feature/sistema-temas |
| Layout General | feature/layout-general |

## Flujo de trabajo
Cada feature se desarrolla en su propia rama siguiendo Spec Driven Development:
1. Se redacta el `SPEC.md` antes de escribir código
2. Se implementa la feature guiada por la spec
3. Se verifica manualmente contra los criterios de aceptación
4. Se abre un Pull Request hacia `develop`

## Documentación
Cada feature incluye en `docs/<nombre-feature>/`:
- `SPEC.md` — especificación de la feature
- `prompt-01.md` — prompts utilizados con el agente IA