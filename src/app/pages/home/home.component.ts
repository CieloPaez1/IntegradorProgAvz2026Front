import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  projects = signal<Project[]>([]);
  tasks = signal<Task[]>([]);

  ngOnInit(): void {
    this.projectService.getAll().subscribe({
      next: (data) => this.projects.set(data),
      error: () => this.projects.set([])
    });
    this.taskService.getAll().subscribe({
      next: (data) => this.tasks.set(data),
      error: () => this.tasks.set([])
    });
  }

  get totalProyectos(): number {
    return this.projects().length;
  }

  get proyectosPlanificados(): number {
    return this.projects().filter(p => p.status === 'PLANNED').length;
  }

  get proyectosEnProceso(): number {
    return this.projects().filter(p => p.status === 'ACTIVE').length;
  }

  get proyectosTerminados(): number {
    return this.projects().filter(p => p.status === 'CLOSED').length;
  }

  get porcentajeProyectosTerminados(): number {
    return this.percentage(this.proyectosTerminados, this.totalProyectos);
  }

  get totalTareas(): number {
    return this.tasks().length;
  }

  get tareasEnProgreso(): number {
    return this.tasks().filter(t => t.status === 'IN_PROGRESS').length;
  }

  get tareasCompletadas(): number {
    return this.tasks().filter(t => t.status === 'DONE').length;
  }

  get tareasPendientes(): number {
    return this.tasks().filter(t => t.status === 'TODO').length;
  }

  get porcentajeTareasCompletadas(): number {
    return this.percentage(this.tareasCompletadas, this.totalTareas);
  }

  projectStatusLabel(status: Project['status']): string {
    const labels: Record<Project['status'], string> = {
      PLANNED: 'Planificado',
      ACTIVE: 'En proceso',
      CLOSED: 'Terminado'
    };

    return labels[status];
  }

  taskStatusLabel(status: Task['status']): string {
    const labels: Record<Task['status'], string> = {
      TODO: 'Por hacer',
      IN_PROGRESS: 'En proceso',
      DONE: 'Hecha'
    };

    return labels[status];
  }

  private percentage(value: number, total: number): number {
    return total === 0 ? 0 : Math.round((value / total) * 100);
  }
}
