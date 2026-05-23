import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-project.component.html'
})
export class CreateProjectComponent {

  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);

  projects = signal<Project[]>(this.cargarDelStorage());
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

  cargarDelStorage(): Project[] {
    const data = localStorage.getItem('projects');
    return data ? JSON.parse(data) : [];
  }

  guardarEnStorage(lista: Project[]): void {
    localStorage.setItem('projects', JSON.stringify(lista));
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
        const nuevaLista = [...this.projects(), created];
        this.projects.set(nuevaLista);
        this.guardarEnStorage(nuevaLista);
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