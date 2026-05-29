import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskStatusPipe } from '../../pipes/task-status.pipe';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TaskStatusPipe],
  template: `
    <div class="detail-page" *ngIf="task(); else loading">
      <header>
        <p class="eyebrow">Detalle de Tarea</p>
        <h1>{{ task()?.title }}</h1>
        <span class="status-pill">{{ task()?.status | taskStatus }}</span>
      </header>
      
      <section class="card">
        <div class="info-grid">
          <div>
            <strong>Responsable:</strong>
            <p>{{ task()?.assignee || 'Sin asignar' }}</p>
          </div>
          <div>
            <strong>Proyecto:</strong>
            <p>{{ task()?.projectName || 'Sin proyecto' }}</p>
          </div>
          <div>
            <strong>Horas estimadas:</strong>
            <p>{{ task()?.estimateHours || 0 }} hs</p>
          </div>
        </div>
      </section>

      <a routerLink="/" class="back-link">Volver al inicio</a>
    </div>

    <ng-template #loading>
      <div class="loading">Cargando tarea...</div>
    </ng-template>
  `,
  styles: [`
    .detail-page { padding: 2rem; max-width: 800px; margin: 0 auto; }
    .eyebrow { text-transform: uppercase; font-size: 0.8rem; color: #666; margin-bottom: 0.5rem; }
    h1 { margin: 0 0 1rem; }
    .status-pill { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 999px; background: #eee; font-size: 0.85rem; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid #ddd; margin: 2rem 0; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    .info-grid p { margin: 0.25rem 0 0; }
    .back-link { color: #0066cc; text-decoration: none; }
    .back-link:hover { text-decoration: underline; }
    .loading { padding: 2rem; text-align: center; color: #666; }
  `]
})
export class TaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  
  task = signal<Task | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.taskService.getAll().subscribe(tasks => {
        const t = tasks.find(x => x.id === id);
        this.task.set(t || null);
      });
    }
  }
}
