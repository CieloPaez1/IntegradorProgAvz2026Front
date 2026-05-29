import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { TaskStatusPipe } from '../../pipes/task-status.pipe';

@Component({
  selector: 'app-project-report',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskStatusPipe],
  templateUrl: './project-report.component.html',
  styleUrl: './project-report.component.css'
})
export class ProjectReportComponent implements OnInit {
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  projects = signal<Project[]>([]);
  tasks = signal<Task[]>([]);
  selectedProjectId = signal('');

  ngOnInit(): void {
    this.projectService.getAll().subscribe({
      next: data => {
        this.projects.set(data);
        this.selectedProjectId.set(data[0]?.id?.toString() ?? '');
      },
      error: () => this.projects.set([])
    });

    this.taskService.getAll().subscribe({
      next: data => this.tasks.set(data),
      error: () => this.tasks.set([])
    });
  }

  selectedProject = computed(() => {
    const id = Number(this.selectedProjectId());
    return this.projects().find(project => project.id === id);
  });

  projectTasks = computed(() => {
    const id = Number(this.selectedProjectId());
    return this.tasks().filter(task => task.projectId === id);
  });

  totalTasks = computed(() => this.projectTasks().length);
  pendingTasks = computed(() => this.projectTasks().filter(task => task.status === 'TODO').length);
  inProgressTasks = computed(() => this.projectTasks().filter(task => task.status === 'IN_PROGRESS').length);
  doneTasks = computed(() => this.projectTasks().filter(task => task.status === 'DONE').length);

  totalHours = computed(() => this.projectTasks().reduce((sum, task) => sum + (task.estimateHours || 0), 0));
  
  doneHours = computed(() => this.projectTasks()
    .filter(task => task.status === 'DONE')
    .reduce((sum, task) => sum + (task.estimateHours || 0), 0)
  );

  progress = computed(() => this.totalTasks() === 0 ? 0 : Math.round((this.doneTasks() / this.totalTasks()) * 100));

}
