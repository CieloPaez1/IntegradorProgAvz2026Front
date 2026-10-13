import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

// =============================================================================
// [IONIC - AVANZADA 3] IMPORTACIÓN DE COMPONENTES NATIVOS DE IONIC
// Importamos cada directiva de Ionic como Standalone para componer la UI móvil.
// =============================================================================
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonChip,
  IonIcon,
  IonFab,
  IonFabButton,
  IonFabList,
  IonButtons,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner
} from '@ionic/angular';

// [IONIC] addIcons para registrar los glifos de Ionicons utilizados
import { addIcons } from 'ionicons';
import {
  refreshOutline,
  addOutline,
  briefcaseOutline,
  checkboxOutline,
  trendingUpOutline,
  timeOutline,
  logOutOutline,
  desktopOutline,
  chevronForwardOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

// Importación de servicios existentes (reutilizados limpiamente)
import { ProjectService } from '../../../services/project.service';
import { TaskService } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';
import { Project } from '../../../models/project.model';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-mobile-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // [IONIC] Directivas de Ionic registradas en el componente standalone
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonChip,
    IonIcon,
    IonFab,
    IonFabButton,
    IonFabList,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner
  ],
  templateUrl: './mobile-dashboard.component.html',
  styleUrls: ['./mobile-dashboard.component.css']
})
export class MobileDashboardComponent implements OnInit {
  // Inyección de dependencias de Angular
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  private router = inject(Router);

  // Signals para estado reactivo
  projects = signal<Project[]>([]);
  tasks = signal<Task[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Signals computados para métricas clave móviles
  totalProjects = computed(() => this.projects().length);
  activeProjects = computed(() => this.projects().filter(p => p.status === 'ACTIVE').length);
  totalTasks = computed(() => this.tasks().length);
  completedTasks = computed(() => this.tasks().filter(t => t.status === 'DONE').length);
  pendingTasks = computed(() => this.tasks().filter(t => t.status === 'TODO').slice(0, 5));

  completionPercentage = computed(() => {
    const total = this.totalTasks();
    if (total === 0) return 0;
    return Math.round((this.completedTasks() / total) * 100);
  });

  constructor() {
    // [IONIC] Registramos los iconos de Ionicons para los botones y tarjetas
    addIcons({
      refreshOutline,
      addOutline,
      briefcaseOutline,
      checkboxOutline,
      trendingUpOutline,
      timeOutline,
      logOutOutline,
      desktopOutline,
      chevronForwardOutline,
      checkmarkCircleOutline
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(event?: any): void {
    if (!event) {
      this.loading.set(true);
    }
    this.error.set(null);

    // [RXJS] forkJoin para cargar proyectos y tareas en paralelo
    forkJoin({
      projects: this.projectService.getAll(),
      tasks: this.taskService.getAll()
    }).subscribe({
      next: ({ projects, tasks }) => {
        this.projects.set(projects);
        this.tasks.set(tasks);
        this.loading.set(false);

        // [IONIC] Notificamos al ion-refresher que la recarga terminó
        if (event) {
          event.target.complete();
        }
      },
      error: (err: Error) => {
        this.error.set(err.message || 'Error al conectar con la API');
        this.loading.set(false);
        if (event) {
          event.target.complete();
        }
      }
    });
  }

  // [IONIC] Manejador del gesto táctil Pull-To-Refresh
  handleRefresh(event: any): void {
    this.cargarDatos(event);
  }

  irAVersionEscritorio(): void {
    this.router.navigate(['/home']);
  }

  marcarComoHecha(task: Task, event: Event): void {
    event.stopPropagation();
    if (!task.id || !task.projectId) return;

    const copia = { ...task, status: 'DONE' as const };
    this.taskService.update(task.projectId, task.id, copia).subscribe({
      next: () => {
        this.tasks.update(ts => ts.map(t => t.id === task.id ? copia : t));
      }
    });
  }
}
