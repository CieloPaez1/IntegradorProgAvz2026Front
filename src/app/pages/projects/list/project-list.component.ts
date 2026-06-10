import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { TaskService } from '../../../services/task.service';
import { Project } from '../../../models/project.model';
import { LucideFolderKanban, LucideEdit, LucideTrash2, LucidePlus, LucideSearch } from '@lucide/angular';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideFolderKanban, LucideEdit, LucideTrash2, LucidePlus, LucideSearch],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit {

  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);

  projects = signal<Project[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  filter = signal<string | null>(null);
  searchTerm = signal<string>('');

  filteredProjects = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.projects();
    return this.projects().filter(p => 
      (p.name && p.name.toLowerCase().includes(term)) || 
      (p.description && p.description.toLowerCase().includes(term))
    );
  });

  ngOnInit(): void {
    this.filter.set(this.route.snapshot.queryParamMap.get('filter'));
    this.cargarProyectos();
  }

  cargarProyectos(): void {
    this.loading.set(true);
    forkJoin({
      projects: this.projectService.getAll(),
      tasks: this.taskService.getAll()
    }).subscribe({
      next: (res) => {
        let filteredProjects = res.projects;
        const filter = this.route.snapshot.queryParamMap.get('filter');
        
        if (filter === 'empty') {
          const projectIdsWithTasks = new Set(res.tasks.map(t => t.projectId));
          filteredProjects = filteredProjects.filter(p => p.id && !projectIdsWithTasks.has(p.id));
        }

        this.projects.set(filteredProjects);
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
