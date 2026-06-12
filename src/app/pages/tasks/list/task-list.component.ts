import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { ProjectService } from '../../../services/project.service';
import { Task } from '../../../models/task.model';
import { Project } from '../../../models/project.model';
import { LucideCheckSquare, LucideEdit, LucideTrash2, LucideSearch, LucideRotateCcw } from '@lucide/angular';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideCheckSquare, LucideEdit, LucideTrash2, LucideSearch, LucideRotateCcw],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  tasks = signal<Task[]>([]);
  projects = signal<Project[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  filter = signal<string | null>(null);
  searchTerm = signal<string>('');
  statusFilter = signal<string>('ALL');

  filteredTasks = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.statusFilter();
    let result = this.tasks();

    if (status !== 'ALL') {
      result = result.filter(t => t.status === status);
    }

    if (term) {
      result = result.filter(t => 
        (t.title && t.title.toLowerCase().includes(term)) || 
        (t.assignee && t.assignee.toLowerCase().includes(term)) ||
        (this.getProjectName(t.projectId).toLowerCase().includes(term))
      );
    }

    return result;
  });

  ngOnInit(): void {
    const routeFilter = this.route.snapshot.queryParamMap.get('filter');
    this.filter.set(routeFilter);
    if (routeFilter === 'todo') {
      this.statusFilter.set('TODO');
    }
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      projects: this.projectService.getAll(),
      tasks: this.taskService.getAll()
    }).subscribe({
      next: (result) => {
        this.projects.set(result.projects);
        
        let fetchedTasks = result.tasks.reverse();
        if (this.filter() === 'unassigned') {
          fetchedTasks = fetchedTasks.filter(t => !t.assignee || t.assignee.trim() === '');
        }
        this.tasks.set(fetchedTasks);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  getProjectName(projectId: number | undefined): string {
    if (!projectId) return 'Desconocido';
    return this.projects().find(p => p.id === projectId)?.name || 'Desconocido';
  }

  reabrirTarea(t: Task): void {
    if (confirm(`¿Estás seguro de que quieres reabrir la tarea "${t.title}"?`)) {
      this.cambiarEstado(t, 'IN_PROGRESS');
    }
  }

  eliminarTarea(t: Task): void {
    if (!t.id || !t.projectId) return;
    if (confirm(`¿Estás seguro de que quieres eliminar la tarea "${t.title}"?`)) {
      this.taskService.delete(t.projectId, t.id).subscribe({
        next: () => {
          this.tasks.update(ts => ts.filter(task => task.id !== t.id));
        },
        error: (err: Error) => alert('Error al eliminar la tarea: ' + err.message)
      });
    }
  }

  goToEdit(t: Task, event: Event): void {
    event.stopPropagation();
    if (t.projectId && t.id && t.status !== 'DONE') {
      this.router.navigate(['/projects', t.projectId, 'tasks', 'edit', t.id]);
    }
  }

  cambiarEstado(t: Task, nuevoEstado: string): void {
    if (!t.id || !t.projectId) return;

    if (nuevoEstado === 'DONE' && t.status !== 'DONE') {
      const ok = window.confirm('¿Seguro que querés marcar esta tarea como Hecha? Se bloqueará su edición.');
      if (!ok) {
        this.tasks.update(ts => [...ts]);
        return;
      }
    }

    const estadoAnterior = t.status;
    t.status = nuevoEstado as any;

    this.taskService.update(t.projectId, t.id, t).subscribe({
      next: () => {
        // success
      },
      error: (err) => {
        console.error('Error cambiando estado', err);
        t.status = estadoAnterior;
        alert('No se pudo cambiar el estado de la tarea');
      }
    });
  }
}
