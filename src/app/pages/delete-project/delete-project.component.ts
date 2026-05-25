import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-delete-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-project.component.html'
})
export class DeleteProjectComponent {

  private projectService = inject(ProjectService);

  projects = signal<Project[]>(this.cargarDelStorage());
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  cargarDelStorage(): Project[] {
    const data = localStorage.getItem('projects');
    return data ? JSON.parse(data) : [];
  }

  guardarEnStorage(lista: Project[]): void {
    localStorage.setItem('projects', JSON.stringify(lista));
  }

  eliminar(id: number): void {
    const confirmado = confirm('¿Estás segura de que querés eliminar este proyecto?');
    if (!confirmado) return;

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    this.projectService.delete(id).subscribe({
      next: () => {
        const nuevaLista = this.projects().filter(p => p.id !== id);
        this.projects.set(nuevaLista);
        this.guardarEnStorage(nuevaLista);
        this.success.set('Proyecto eliminado correctamente.');
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}