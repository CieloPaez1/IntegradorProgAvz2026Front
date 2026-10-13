import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

// [IONIC - AVANZADA 3] Componentes de Ionic para listado y segmentos de tareas
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
  IonIcon,
  IonButton,
  IonButtons,
  IonBadge,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  addOutline,
  checkmarkCircle,
  ellipseOutline,
  timeOutline,
  trashOutline,
  createOutline,
  checkboxOutline
} from 'ionicons/icons';

import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-mobile-tasks',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // [IONIC] Componentes registrados
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonIcon,
    IonButton,
    IonButtons,
    IonBadge,
    IonRefresher,
    IonRefresherContent
  ],
  templateUrl: './mobile-tasks.component.html',
  styleUrls: ['./mobile-tasks.component.css']
})
export class MobileTasksComponent implements OnInit {
  private taskService = inject(TaskService);
  private router = inject(Router);

  tasks = signal<Task[]>([]);
  statusFilter = signal<string>('ALL');
  loading = signal<boolean>(true);

  // [SIGNALS] Filtrado reactivo conectado al ion-segment móvil
  filteredTasks = computed(() => {
    const filter = this.statusFilter();
    if (filter === 'ALL') return this.tasks();
    return this.tasks().filter(t => t.status === filter);
  });

  constructor() {
    addIcons({
      addOutline,
      checkmarkCircle,
      ellipseOutline,
      timeOutline,
      trashOutline,
      createOutline,
      checkboxOutline
    });
  }

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas(event?: any): void {
    this.taskService.getAll().subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.loading.set(false);
        if (event) event.target.complete();
      },
      error: () => {
        this.loading.set(false);
        if (event) event.target.complete();
      }
    });
  }

  // [IONIC] Manejador de evento al cambiar de pestaña en ion-segment
  onFilterChange(event: any): void {
    this.statusFilter.set(event.detail.value);
  }

  toggleCompletada(t: Task): void {
    if (!t.id || !t.projectId) return;

    const nuevoEstado = t.status === 'DONE' ? 'TODO' : 'DONE';
    const copia = { ...t, status: nuevoEstado as any };

    this.taskService.update(t.projectId, t.id, copia).subscribe({
      next: () => {
        this.tasks.update(ts => ts.map(item => item.id === t.id ? copia : item));
      }
    });
  }

  eliminarTarea(t: Task, event: Event): void {
    event.stopPropagation();
    if (!t.id || !t.projectId) return;
    if (confirm(`¿Eliminar la tarea "${t.title}"?`)) {
      this.taskService.delete(t.projectId, t.id).subscribe({
        next: () => {
          this.tasks.update(ts => ts.filter(item => item.id !== t.id));
        }
      });
    }
  }
}
