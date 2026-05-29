import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

import { LucideFolderKanban, LucideCheckCircle, LucideXCircle, LucideSave, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideFolderKanban, LucideCheckCircle, LucideXCircle, LucideSave, LucideX],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProjectComponent implements OnInit {

  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);

  projects = signal<Project[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    status: ['', [Validators.required]],
    description: ['']
  }, { validators: this.validarFechas });

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

    this.projectService.create(this.form.value as Project).subscribe({
      next: (created) => {
        this.projects.update(list => [...list, created]);
        this.form.reset({ status: '' });
        this.success.set('Proyecto creado correctamente.');
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  cancelar(): void {
    this.form.reset({ status: '' });
    this.error.set(null);
    this.success.set(null);
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
}