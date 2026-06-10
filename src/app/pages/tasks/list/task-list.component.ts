import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { ProjectService } from '../../../services/project.service';
import { Task } from '../../../models/task.model';
import { Project } from '../../../models/project.model';
import { LucideListTodo, LucideEdit, LucideTrash2 } from '@lucide/angular';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideListTodo, LucideEdit, LucideTrash2],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);

  tasks = signal<Task[]>([]);
  projects = signal<Project[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  filter = signal<string | null>(null);

  ngOnInit(): void {
    this.filter.set(this.route.snapshot.queryParamMap.get('filter'));
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      tasks: this.taskService.getAll(),
      projects: this.projectService.getAll()
    }).subscribe({
      next: (res) => {
        let filteredTasks = res.tasks;
        const filter = this.route.snapshot.queryParamMap.get('filter');
        
        if (filter === 'unassigned') {
          filteredTasks = filteredTasks.filter(t => !t.assignee || t.assignee.trim() === '');
        } else if (filter === 'todo') {
          filteredTasks = filteredTasks.filter(t => t.status === 'TODO');
        }

        this.tasks.set(filteredTasks);
        this.projects.set(res.projects);
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
}
