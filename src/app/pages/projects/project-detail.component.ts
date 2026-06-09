import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { ProjectStatusPipe } from '../../pipes/project-status.pipe';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskStatusPipe } from '../../pipes/task-status.pipe';
import { LucideArrowLeft, LucideEdit } from '@lucide/angular';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectStatusPipe, TaskStatusPipe, LucideArrowLeft, LucideEdit],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  
  project = signal<Project | null>(null);
  tasks = signal<Task[]>([]);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.projectService.getAll().subscribe(projects => {
        const p = projects.find(x => x.id === id);
        this.project.set(p || null);
      });
      this.taskService.getAll().subscribe(allTasks => {
        this.tasks.set(allTasks.filter(t => t.projectId === id));
      });
    }
  }
}
