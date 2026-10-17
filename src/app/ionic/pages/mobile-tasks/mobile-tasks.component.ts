import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

// =============================================================================
// [IONIC 9 - CLASES 2, 3, 5 Y 6: LISTADO DE TAREAS, FAB, RXJS Y CACHÉ OFFLINE]
// Marco Teórico de Cátedra:
// - Clase 2: Importación selectiva de IonCheckbox, IonBadge, IonFab, IonFabButton.
// - Clase 3: IonMenuButton en slot="start" del toolbar para desplegar el ion-menu.
// - Clase 5: Ciclo de vida de petición con 3 estados de UI (tasks, loading, error)
//   y operadores RxJS catchError + finalize (finalize apaga siempre el loading).
// - Clase 6: Estrategia Network-First con @capacitor/preferences y @capacitor/network:
//   intenta cargar desde la API REST y persiste en disco con saveTasks(); si no hay
//   red o falla el servidor, recupera la última caché guardada con loadTasks().
// =============================================================================
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonCheckbox,
  IonIcon,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonBadge,
  IonFab,
  IonFabButton,
  IonSpinner,
  IonText,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  add,
  addOutline,
  trashOutline,
  checkboxOutline,
  cloudOfflineOutline
} from 'ionicons/icons';

import { TaskService } from '../../../services/task.service';
import { IonicStorageService } from '../../services/ionic-storage.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-mobile-tasks',
  standalone: true,
  imports: [
    RouterModule,
    // [CLASE 2, 3 y 5] Componentes standalone de Ionic
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonCheckbox,
    IonIcon,
    IonButton,
    IonButtons,
    IonMenuButton,
    IonBadge,
    IonFab,
    IonFabButton,
    IonSpinner,
    IonText,
    IonRefresher,
    IonRefresherContent
  ],
  templateUrl: './mobile-tasks.component.html',
  styleUrls: ['./mobile-tasks.component.css']
})
export class MobileTasksComponent implements OnInit {
  private taskService = inject(TaskService);
  readonly storage = inject(IonicStorageService);
  private router = inject(Router);

  // [CLASE 5] Los 3 estados de la UI modelados con Signals
  tasks = signal<Task[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  statusFilter = signal<string>('ALL');

  // [SIGNALS] Filtrado reactivo conectado al ion-segment móvil
  filteredTasks = computed(() => {
    const filter = this.statusFilter();
    if (filter === 'ALL') return this.tasks();
    return this.tasks().filter(t => t.status === filter);
  });

  constructor() {
    // [CLASE 2] Registro selectivo de íconos con addIcons (tree-shaking)
    addIcons({
      add,
      addOutline,
      trashOutline,
      checkboxOutline,
      cloudOfflineOutline
    });
  }

  ngOnInit(): void {
    this.cargarTareas();
  }

  // ===========================================================================
  // [CLASES 5 Y 6 - EJERCICIO 17 Y 20] COMBINAR SERVICIO REMOTO Y CACHÉ LOCAL
  // ===========================================================================
  async cargarTareas(event?: any): Promise<void> {
    if (!event) {
      this.loading.set(true);
    }
    this.error.set(null);

    if (await this.storage.isOnline()) {
      this.taskService.getAll().pipe(
        catchError(() => {
          this.error.set('Modo Offline: Mostrando últimas tareas guardadas en el dispositivo.');
          return of(null);
        }),
        finalize(() => {
          this.loading.set(false);
          if (event) event.target.complete();
        })
      ).subscribe(async (remoteTasks) => {
        if (remoteTasks !== null) {
          this.tasks.set(remoteTasks);
          // [CLASE 6] Guardamos en @capacitor/preferences para uso offline
          await this.storage.saveTasks(remoteTasks);
        } else {
          // [CLASE 6] Fallback offline: cargamos desde @capacitor/preferences
          const cached = await this.storage.loadTasks();
          this.tasks.set(cached);
        }
      });
    } else {
      // Sin conexión detectada por @capacitor/network
      this.error.set('Sin conexión a internet: mostrando tareas desde @capacitor/preferences.');
      const cached = await this.storage.loadTasks();
      this.tasks.set(cached);
      this.loading.set(false);
      if (event) event.target.complete();
    }
  }

  onFilterChange(event: any): void {
    this.statusFilter.set(event.detail.value);
  }

  toggleCompletada(t: Task): void {
    if (!t.id || !t.projectId) return;

    const nuevoEstado = t.status === 'DONE' ? 'TODO' : 'DONE';
    const copia = { ...t, status: nuevoEstado as any };

    this.taskService.update(t.projectId, t.id, copia).subscribe({
      next: async () => {
        this.tasks.update(ts => ts.map(item => item.id === t.id ? copia : item));
        await this.storage.saveTasks(this.tasks());
      },
      error: async () => {
        // Actualización optimista en caché local si está offline
        this.tasks.update(ts => ts.map(item => item.id === t.id ? copia : item));
        await this.storage.saveTasks(this.tasks());
      }
    });
  }

  eliminarTarea(t: Task, event: Event): void {
    event.stopPropagation();
    if (!t.id || !t.projectId) return;
    if (confirm(`¿Eliminar la tarea "${t.title}"?`)) {
      this.taskService.delete(t.projectId, t.id).subscribe({
        next: async () => {
          this.tasks.update(ts => ts.filter(item => item.id !== t.id));
          await this.storage.saveTasks(this.tasks());
        }
      });
    }
  }
}
