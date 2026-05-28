import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-reports-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reports-summary.component.html',
  styleUrl: './reports-summary.component.css'
})
export class ReportsSummaryComponent implements OnInit {
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  projects = signal<Project[]>([]);
  tasks = signal<Task[]>([]);

  ngOnInit(): void {
    this.projectService.getAll().subscribe({
      next: data => this.projects.set(data),
      error: () => this.projects.set([])
    });

    this.taskService.getAll().subscribe({
      next: data => this.tasks.set(data),
      error: () => this.tasks.set([])
    });
  }

  get totalProjects(): number {
    return this.projects().length;
  }

  get activeProjects(): number {
    return this.projects().filter(project => project.status === 'ACTIVE').length;
  }

  get plannedProjects(): number {
    return this.projects().filter(project => project.status === 'PLANNED').length;
  }

  get closedProjects(): number {
    return this.projects().filter(project => project.status === 'CLOSED').length;
  }

  get totalTasks(): number {
    return this.tasks().length;
  }

  get doneTasks(): number {
    return this.tasks().filter(task => task.status === 'DONE').length;
  }

  get inProgressTasks(): number {
    return this.tasks().filter(task => task.status === 'IN_PROGRESS').length;
  }

  get pendingTasks(): number {
    return this.tasks().filter(task => task.status === 'TODO').length;
  }

  get unassignedTasks(): number {
    return this.tasks().filter(task => !task.assignee?.trim()).length;
  }

  get projectsWithoutTasks(): number {
    return this.projects().filter(project =>
      !this.tasks().some(task => task.projectId === project.id)
    ).length;
  }

  get estimatedHours(): number {
    return this.tasks().reduce((sum, task) => sum + (task.estimateHours || 0), 0);
  }

  get doneHours(): number {
    return this.tasks()
      .filter(task => task.status === 'DONE')
      .reduce((sum, task) => sum + (task.estimateHours || 0), 0);
  }

  get taskProgress(): number {
    return this.percent(this.doneTasks, this.totalTasks);
  }

  get projectProgress(): number {
    return this.percent(this.closedProjects, this.totalProjects);
  }

  private percent(value: number, total: number): number {
    return total === 0 ? 0 : Math.round((value / total) * 100);
  }
}
