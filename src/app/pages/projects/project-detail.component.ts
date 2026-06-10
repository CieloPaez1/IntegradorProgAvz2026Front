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
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ProjectStatusPipe, TaskStatusPipe, LucideArrowLeft, LucideEdit, LucideTrash2, LucidePlus, LucideSave],
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
  
  isEditingProject = signal(false);
  isAddingTask = signal(false);
  isLoading = signal(false);

  projectForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    status: ['', Validators.required]
  });

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
        if (p) {
          this.projectForm.patchValue(p);
        }
      });
      this.taskService.getAll().subscribe(allTasks => {
        this.tasks.set(allTasks.filter(t => t.projectId === id).reverse());
      });
    }
  }

  toggleEditProject() {
    this.isEditingProject.set(!this.isEditingProject());
    if (!this.isEditingProject() && this.project()) {
      this.projectForm.patchValue(this.project()!);
    }
  }

  saveProject() {
    if (this.projectForm.invalid || !this.project()) return;
    this.isLoading.set(true);
    const updated = { ...this.project(), ...this.projectForm.value };
    this.projectService.update(updated.id!, updated).subscribe({
      next: (res) => {
        this.project.set(res);
        this.isEditingProject.set(false);
        this.isLoading.set(false);
      },
      error: (err) => {
        alert('Error al actualizar el proyecto: ' + err.message);
        this.isLoading.set(false);
      }
    });
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
