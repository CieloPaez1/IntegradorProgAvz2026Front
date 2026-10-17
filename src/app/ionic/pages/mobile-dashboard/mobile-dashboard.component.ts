import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { catchError, finalize, forkJoin, of } from 'rxjs';

// =============================================================================
// [IONIC 9 - CLASES 1 A 6] DASHBOARD MÓVIL CON GESTOS, MENÚ Y CACHÉ OFFLINE
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
  IonMenuButton,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText
} from '@ionic/angular';

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
  checkmarkCircleOutline,
  sparklesOutline,
  cloudOfflineOutline
} from 'ionicons/icons';

import { ProjectService } from '../../../services/project.service';
import { TaskService } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';
import { IonicStorageService } from '../../services/ionic-storage.service';
import { Project } from '../../../models/project.model';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-mobile-dashboard',
  standalone: true,
  imports: [
    RouterModule,
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
    IonMenuButton,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
    IonText
  ],
  templateUrl: './mobile-dashboard.component.html',
  styleUrls: ['./mobile-dashboard.component.css']
})
export class MobileDashboardComponent implements OnInit {
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly storage = inject(IonicStorageService);
  private router = inject(Router);

  // [CLASE 5] Los 3 estados de la interfaz modelados con Signals
  projects = signal<Project[]>([]);
  tasks = signal<Task[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

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
      checkmarkCircleOutline,
      sparklesOutline,
      cloudOfflineOutline
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  // [CLASES 5 Y 6] Carga paralela con forkJoin + catchError + finalize + Preferences
  async cargarDatos(event?: any): Promise<void> {
    if (!event) {
      this.loading.set(true);
    }
    this.error.set(null);

    if (await this.storage.isOnline()) {
      forkJoin({
        projects: this.projectService.getAll(),
        tasks: this.taskService.getAll()
      }).pipe(
        catchError(() => {
          this.error.set('Modo Offline: Mostrando datos guardados en @capacitor/preferences.');
          return of(null);
        }),
        finalize(() => {
          this.loading.set(false);
          if (event) event.target.complete();
        })
      ).subscribe(async (res) => {
        if (res !== null) {
          this.projects.set(res.projects);
          this.tasks.set(res.tasks);
          await this.storage.saveProjects(res.projects);
          await this.storage.saveTasks(res.tasks);
        } else {
          this.projects.set(await this.storage.loadProjects());
          this.tasks.set(await this.storage.loadTasks());
        }
      });
    } else {
      this.error.set('Sin conexión: datos cargados desde almacenamiento local (Preferences).');
      this.projects.set(await this.storage.loadProjects());
      this.tasks.set(await this.storage.loadTasks());
      this.loading.set(false);
      if (event) event.target.complete();
    }
  }

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
      next: async () => {
        this.tasks.update(ts => ts.map(t => t.id === task.id ? copia : t));
        await this.storage.saveTasks(this.tasks());
      },
      error: async () => {
        this.tasks.update(ts => ts.map(t => t.id === task.id ? copia : t));
        await this.storage.saveTasks(this.tasks());
      }
    });
  }
}
