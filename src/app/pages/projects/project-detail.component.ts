import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { ProjectStatusPipe } from '../../pipes/project-status.pipe';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectStatusPipe],
  template: `
    <div class="detail-page" *ngIf="project(); else loading">
      <header>
        <p class="eyebrow">Detalle de Proyecto</p>
        <h1>{{ project()?.name }}</h1>
        <span class="status-pill">{{ project()?.status | projectStatus }}</span>
      </header>
      
      <section class="card">
        <h3>Descripción</h3>
        <p>{{ project()?.description || 'No hay descripción' }}</p>
      </section>

      <a routerLink="/" class="back-link">Volver al inicio</a>
    </div>

    <ng-template #loading>
      <div class="loading">Cargando proyecto...</div>
    </ng-template>
  `,
  styles: [`
    .detail-page { padding: 2rem; max-width: 800px; margin: 0 auto; }
    .eyebrow { text-transform: uppercase; font-size: 0.8rem; color: #666; margin-bottom: 0.5rem; }
    h1 { margin: 0 0 1rem; }
    .status-pill { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 999px; background: #eee; font-size: 0.85rem; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid #ddd; margin: 2rem 0; }
    .card h3 { margin-top: 0; }
    .back-link { color: #0066cc; text-decoration: none; }
    .back-link:hover { text-decoration: underline; }
    .loading { padding: 2rem; text-align: center; color: #666; }
  `]
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  
  project = signal<Project | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.projectService.getAll().subscribe(projects => {
        const p = projects.find(x => x.id === id);
        this.project.set(p || null);
      });
    }
  }
}
