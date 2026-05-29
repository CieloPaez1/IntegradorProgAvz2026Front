# IntegradorProgAvz2026Front - Technical Specification

## Core Features
1. **Dashboard (Home)**
   - Vista panorámica de Proyectos y Tareas con gráficos de dona (Chart.js).
   - Listas dinámicas de alertas y métricas en tiempo real.
   - Diseño premium responsive y fluido a ancho completo.
2. **Reportes**
   - **Reporte Global**: Estadísticas de todos los proyectos combinados.
   - **Reporte por Proyecto**: Selección individual para ver estado, horas estimadas vs realizadas.
   - **Exportación PDF**: Utiliza `jspdf` y `html2canvas` para descargar las vistas intactas.
3. **Navegación**
   - Sidebar/Navbar simplificado, orientado al perfil personal/admin.

## Tech Stack
- **Framework:** Angular 17+ (Signals, Standalone Components)
- **Styling:** CSS puro, diseño Grid y Flexbox.
- **Icons:** `lucide-angular`.
- **Charts:** `chart.js`
- **PDF Export:** `jspdf`, `html2canvas`
