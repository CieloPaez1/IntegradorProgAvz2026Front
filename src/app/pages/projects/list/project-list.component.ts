import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';
import { LucideFolderKanban, LucideEdit, LucideTrash2, LucidePlus } from '@lucide/angular';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideFolderKanban, LucideEdit, LucideTrash2, LucidePlus],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit {

  private projectService = inject(ProjectService);

  projects = signal<Project[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos(): void {
    this.loading.set(true);
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  eliminarProyecto(p: Project): void {
    if (!p.id) return;
    if (confirm(`¿Estás seguro de que quieres eliminar el proyecto "${p.name}"?`)) {
      this.projectService.delete(p.id).subscribe({
        next: () => {
          this.projects.update(ps => ps.filter(proj => proj.id !== p.id));
        },
        error: (err: Error) => alert('Error al eliminar el proyecto: ' + err.message)
      });
    }
  }

}
