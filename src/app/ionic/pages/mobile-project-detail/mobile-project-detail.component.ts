import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, finalize, forkJoin, of } from 'rxjs';

// =============================================================================
// [IONIC 9 - DETALLE DE PROYECTO MÓVIL CON TAREAS, SWIPE Y MODAL ANIMADO]
// Vista 100% móvil en Ionic 9 que reemplaza al detalle de escritorio cuando
// el usuario entra a un proyecto desde el celular (/mobile/projects/:id).
// =============================================================================
import {
  AlertController,
  ModalController,
  createAnimation,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonCheckbox,
  IonFab,
  IonFabButton,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonText
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  add,
  addOutline,
  createOutline,
  trashOutline,
  calendarOutline,
  timeOutline,
  checkboxOutline,
  cloudOfflineOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

import { ProjectService } from '../../../services/project.service';
import { TaskService } from '../../../services/task.service';
import { IonicStorageService } from '../../services/ionic-storage.service';
import { Project } from '../../../models/project.model';
import { Task } from '../../../models/task.model';
import { MobileTaskDetailModalComponent } from '../../components/mobile-task-detail-modal/mobile-task-detail-modal.component';

@Component({
  selector: 'app-mobile-project-detail',
  standalone: true,
  imports: [
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonBadge,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonCheckbox,
    IonFab,
    IonFabButton,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonText
  ],
  templateUrl: './mobile-project-detail.component.html',
  styleUrls: ['./mobile-project-detail.component.css']
})
export class MobileProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private storage = inject(IonicStorageService);
  private alertCtrl = inject(AlertController);
  private modalCtrl = inject(ModalController);

  projectId = signal<number>(0);
  project = signal<Project | null>(null);
  tasks = signal<Task[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  statusFilter = signal<string>('ALL');

  filteredTasks = computed(() => {
    const f = this.statusFilter();
    if (f === 'ALL') return this.tasks();
    return this.tasks().filter(t => t.status === f);
  });

  totalTasks = computed(() => this.tasks().length);
  completedTasks = computed(() => this.tasks().filter(t => t.status === 'DONE').length);
  totalHours = computed(() => this.tasks().reduce((acc, t) => acc + (t.estimateHours || 0), 0));

  progressPercentage = computed(() => {
    const total = this.totalTasks();
    if (total === 0) return 0;
    return Math.round((this.completedTasks() / total) * 100);
  });

  constructor() {
    addIcons({
      add,
      addOutline,
      createOutline,
      trashOutline,
      calendarOutline,
      timeOutline,
      checkboxOutline,
      cloudOfflineOutline,
      checkmarkCircleOutline
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.projectId.set(id);
        this.cargarDetalle();
      }
    });
  }

  async cargarDetalle(event?: any): Promise<void> {
    const id = this.projectId();
    if (!id) return;

    if (!event) {
      this.loading.set(true);
    }
    this.error.set(null);

    const cachedProjects = await this.storage.loadProjects();
    const cachedTasks = await this.storage.loadTasks();

    if (await this.storage.isOnline()) {
      forkJoin({
        project: this.projectService.getById(id),
        tasks: this.taskService.getByProject(id)
      }).pipe(
        catchError(() => {
          this.error.set('Modo Offline: mostrando datos del proyecto desde caché local.');
          return of(null);
        }),
        finalize(() => {
          this.loading.set(false);
          if (event) {
            (event.target as HTMLIonRefresherElement).complete();
          }
        })
      ).subscribe(async (res) => {
        if (res !== null) {
          this.project.set(res.project);
          const tasksWithProject = res.tasks.map(t => ({ ...t, projectId: id }));
          this.tasks.set(tasksWithProject);
        } else {
          this.project.set(cachedProjects.find(p => p.id === id) || null);
          this.tasks.set(cachedTasks.filter(t => t.projectId === id));
        }
      });
    } else {
      this.error.set('Sin conexión: proyecto cargado desde @capacitor/preferences.');
      this.project.set(cachedProjects.find(p => p.id === id) || null);
      this.tasks.set(cachedTasks.filter(t => t.projectId === id));
      this.loading.set(false);
      if (event) {
        (event.target as HTMLIonRefresherElement).complete();
      }
    }
  }

  onFilterChange(event: any): void {
    this.statusFilter.set(event.detail.value);
  }

  nuevaTareaEnProyecto(): void {
    this.router.navigate(['/mobile/task-form'], {
      queryParams: { projectId: this.projectId() }
    });
  }

  editarTarea(t: Task, event?: Event): void {
    if (event) event.stopPropagation();
    if (!t.id) return;
    this.router.navigate(['/mobile/task-form', this.projectId(), t.id]);
  }

  async abrirDetalleTarea(task: Task): Promise<void> {
    const enterAnimation = (baseEl: HTMLElement) => {
      const root = baseEl.shadowRoot!;
      const backdropEl = root.querySelector('ion-backdrop');
      const wrapperEl = root.querySelector('.modal-wrapper');

      const parentAnim = createAnimation()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(300);

      if (backdropEl && wrapperEl) {
        const backdrop = createAnimation()
          .addElement(backdropEl)
          .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapper = createAnimation()
          .addElement(wrapperEl)
          .keyframes([
            { offset: 0, opacity: '0', transform: 'translateY(100%)' },
            { offset: 1, opacity: '1', transform: 'translateY(0)' }
          ]);

        parentAnim.addAnimation([backdrop, wrapper]);
      }

      return parentAnim;
    };

    const modal = await this.modalCtrl.create({
      component: MobileTaskDetailModalComponent,
      componentProps: { task: { ...task, projectId: this.projectId() } },
      enterAnimation
    });
    await modal.present();
  }

  toggleCompletada(t: Task, event?: Event): void {
    if (event) event.stopPropagation();
    if (!t.id) return;

    const nuevoEstado = t.status === 'DONE' ? 'TODO' : 'DONE';
    const copia: Task = { ...t, status: nuevoEstado, projectId: this.projectId() };

    this.taskService.update(this.projectId(), t.id, copia).subscribe({
      next: () => {
        this.tasks.update(ts => ts.map(item => item.id === t.id ? copia : item));
      },
      error: () => {
        this.tasks.update(ts => ts.map(item => item.id === t.id ? copia : item));
      }
    });
  }

  async eliminarTarea(t: Task, event?: Event): Promise<void> {
    if (event) event.stopPropagation();
    if (!t.id) return;

    const alert = await this.alertCtrl.create({
      header: '¿Eliminar tarea?',
      message: `Se eliminará "${t.title}" de este proyecto.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.taskService.delete(this.projectId(), t.id!).subscribe({
              next: () => {
                this.tasks.update(ts => ts.filter(item => item.id !== t.id));
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}
