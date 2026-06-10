import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  tasks = signal<Task[]>([]);
  projects = signal<Project[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
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
        this.tasks.set(res.tasks);
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
}
