import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-project-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-report.component.html',
  styleUrl: './project-report.component.css'
})
export class ProjectReportComponent implements OnInit {
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  projects = signal<Project[]>([]);
  tasks = signal<Task[]>([]);
  selectedProjectId = '';

  ngOnInit(): void {
    this.projectService.getAll().subscribe({
      next: data => {
        this.projects.set(data);
        this.selectedProjectId = data[0]?.id?.toString() ?? '';
      },
      error: () => this.projects.set([])
    });

    this.taskService.getAll().subscribe({
      next: data => this.tasks.set(data),
      error: () => this.tasks.set([])
    });
  }

  get selectedProject(): Project | undefined {
    const id = Number(this.selectedProjectId);
    return this.projects().find(project => project.id === id);
  }

  get projectTasks(): Task[] {
    const id = Number(this.selectedProjectId);
    return this.tasks().filter(task => task.projectId === id);
  }

  get totalTasks(): number {
    return this.projectTasks.length;
  }

  get pendingTasks(): number {
    return this.projectTasks.filter(task => task.status === 'TODO').length;
  }

  get inProgressTasks(): number {
    return this.projectTasks.filter(task => task.status === 'IN_PROGRESS').length;
  }

  get doneTasks(): number {
    return this.projectTasks.filter(task => task.status === 'DONE').length;
  }

  get totalHours(): number {
    return this.projectTasks.reduce((sum, task) => sum + (task.estimateHours || 0), 0);
  }

  get doneHours(): number {
    return this.projectTasks
      .filter(task => task.status === 'DONE')
      .reduce((sum, task) => sum + (task.estimateHours || 0), 0);
  }

  get progress(): number {
    return this.totalTasks === 0 ? 0 : Math.round((this.doneTasks / this.totalTasks) * 100);
  }

  taskStatusLabel(status: Task['status']): string {
    const labels: Record<Task['status'], string> = {
      TODO: 'Por hacer',
      IN_PROGRESS: 'En proceso',
      DONE: 'Hecha'
    };

    return labels[status];
  }
}
