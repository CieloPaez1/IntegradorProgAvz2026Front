import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { LucideCheckCircle, LucideXCircle, LucideSave, LucideX, LucidePlus, LucideTrash2 } from '@lucide/angular';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideCheckCircle, LucideXCircle, LucideSave, LucideX, LucidePlus, LucideTrash2],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProjectComponent implements OnInit {

  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);

  projects = signal<Project[]>([]);
  recentProjects = computed(() => [...this.projects()].reverse().slice(0, 5));
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    status: ['', [Validators.required]],
    description: [''],
    includeTasks: [false],
    tasks: this.fb.array([])
  }, { validators: this.validarFechas });

  get tasks(): import('@angular/forms').FormArray {
    return this.form.get('tasks') as import('@angular/forms').FormArray;
  }

  toggleIncludeTasks(value: boolean): void {
    this.form.patchValue({ includeTasks: value });
    if (value && this.tasks.length === 0) {
      this.addTask();
    } else if (!value) {
      this.tasks.clear();
    }
  }

  addTask(): void {
    const taskGroup = this.fb.group({
      title: ['', Validators.required],
      estimateHours: [0, [Validators.required, Validators.min(1)]],
      assignee: [''],
      status: ['', Validators.required]
    });
    this.tasks.push(taskGroup);
  }

  removeTask(index: number): void {
    this.tasks.removeAt(index);
    if (this.tasks.length === 0) {
      this.toggleIncludeTasks(false);
    }
  }

  validarFechas(group: AbstractControl) {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    const hoy = new Date().toISOString().split('T')[0];

    if (end && end < hoy) {
      return { endDatePasada: true };
    }
    if (start && end && end < start) {
      return { endDateMenorQueStart: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos(): void {
    this.projectService.getAll().subscribe({
      next: (data) => this.projects.set(data),
      error: () => this.projects.set([])
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const projectData = { ...this.form.value };
    delete projectData.includeTasks;
    delete projectData.tasks;

    this.projectService.create(projectData as Project).pipe(
      switchMap((createdProject) => {
        const includeTasks = this.form.value.includeTasks;
        const tasksData: Task[] = this.form.value.tasks;

        if (includeTasks && tasksData.length > 0 && createdProject.id) {
          const taskObservables = tasksData.map(t => this.taskService.create(createdProject.id!, t));
          return forkJoin(taskObservables).pipe(
            switchMap(() => of({ project: createdProject, tasksCount: tasksData.length }))
          );
        }
        return of({ project: createdProject, tasksCount: 0 });
      })
    ).subscribe({
      next: (result) => {
        this.projects.update(list => [...list, result.project]);
        this.form.reset({ status: '', includeTasks: false });
        this.tasks.clear();
        
        if (result.tasksCount > 0) {
          this.success.set(`Proyecto y ${result.tasksCount} tareas creados correctamente.`);
        } else {
          this.success.set('Proyecto creado correctamente.');
        }
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  cancelar(): void {
    this.form.reset({ status: '', includeTasks: false });
    this.tasks.clear();
    this.error.set(null);
    this.success.set(null);
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
}