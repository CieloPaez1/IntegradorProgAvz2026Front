import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { ProjectStatusPipe } from '../../pipes/project-status.pipe';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskStatusPipe } from '../../pipes/task-status.pipe';
import { LucideArrowLeft, LucideEdit, LucideTrash2, LucidePlus, LucideSave } from '@lucide/angular';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ProjectStatusPipe, TaskStatusPipe, LucideArrowLeft, LucideTrash2, LucidePlus, LucideSave],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);
  
  project = signal<Project | null>(null);
  tasks = signal<Task[]>([]);
  
  project = signal<Project | null>(null);
  tasks = signal<Task[]>([]);
  
  isAddingTask = signal(false);
  isLoading = signal(false);

  taskForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    estimateHours: [1, [Validators.required, Validators.min(1)]],
    assignee: [''],
    status: ['TODO', Validators.required],
    dueDate: ['']
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.projectService.getAll().subscribe(projects => {
        const p = projects.find(x => x.id === id);
        this.project.set(p || null);
      });
      this.taskService.getAll().subscribe(allTasks => {
        this.tasks.set(allTasks.filter(t => t.projectId === id).reverse());
      });
    }
  }

  deleteProject() {
    const p = this.project();
    if (!p) return;
    if (confirm(`¿Estás seguro de eliminar el proyecto "${p.name}"?`)) {
      this.isLoading.set(true);
      this.projectService.delete(p.id!).subscribe({
        next: () => {
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          alert('Error al eliminar el proyecto: ' + err.message);
          this.isLoading.set(false);
        }
      });
    }
  }

  toggleAddTask() {
    this.isAddingTask.set(!this.isAddingTask());
    if (!this.isAddingTask()) {
      this.taskForm.reset({ status: 'TODO', estimateHours: 1 });
    }
  }

  saveTask() {
    if (this.taskForm.invalid || !this.project()) return;
    this.isLoading.set(true);
    this.taskService.create(this.project()!.id!, this.taskForm.value).subscribe({
      next: () => {
        this.cargarDatos();
        this.toggleAddTask();
        this.isLoading.set(false);
      },
      error: (err) => {
        alert('Error al agregar tarea: ' + err.message);
        this.isLoading.set(false);
      }
    });
  }

  deleteTask(t: Task, event: Event) {
    event.stopPropagation();
    if (confirm(`¿Eliminar la tarea "${t.title}"?`)) {
      if (!t.projectId || !t.id) return;
      this.taskService.delete(t.projectId, t.id).subscribe({
        next: () => {
          this.tasks.update(ts => ts.filter(task => task.id !== t.id));
        },
        error: (err) => alert('Error al eliminar tarea: ' + err.message)
      });
    }
  }
}
