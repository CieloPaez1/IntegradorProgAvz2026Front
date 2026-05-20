import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent {

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
    status: ['PLANNED', [Validators.required]],
    description: ['']
  });

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    this.projectService.create(this.form.value as Project).subscribe({
      next: (created) => {
        this.projects.update(list => [...list, created]);
        this.form.reset({ status: 'PLANNED' });
        this.success.set('Proyecto creado correctamente.');
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  delete(id: number): void {
    this.error.set(null);
    this.success.set(null);

    this.projectService.delete(id).subscribe({
      next: () => {
        this.projects.update(list => list.filter(p => p.id !== id));
        this.success.set('Proyecto eliminado correctamente.');
      },
      error: (err: Error) => {
        this.error.set(err.message);
      }
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
}