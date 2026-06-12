import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { LucideArrowLeft, LucideEdit, LucideTrash2, LucideRotateCcw } from '@lucide/angular';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, LucideArrowLeft, LucideEdit, LucideTrash2, LucideRotateCcw],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);
  
  task = signal<Task | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.taskService.getAll().subscribe(tasks => {
        const t = tasks.find(x => x.id === id);
        this.task.set(t || null);
      });
    }
  }

  deleteTask() {
    const t = this.task();
    if (!t) return;
    if (confirm(`¿Estás seguro de eliminar la tarea "${t.title}"?`)) {
      if (!t.projectId || !t.id) return;
      this.isLoading.set(true);
      this.taskService.delete(t.projectId, t.id).subscribe({
        next: () => {
          this.router.navigate(['/tasks/list']);
        },
        error: (err) => {
          alert('Error al eliminar la tarea: ' + err.message);
          this.isLoading.set(false);
        }
      });
    }
  }

  cambiarEstado(nuevoEstado: string): void {
    const t = this.task();
    if (!t || !t.id || !t.projectId) return;

    if (nuevoEstado === 'DONE' && t.status !== 'DONE') {
      const ok = window.confirm('¿Seguro que querés marcar esta tarea como Hecha? Se bloqueará su edición.');
      if (!ok) {
        // Trigger CD by re-setting the object
        this.task.set({ ...t });
        return;
      }
    }

    const estadoAnterior = t.status;
    t.status = nuevoEstado as any;

    this.taskService.update(t.projectId, t.id, t).subscribe({
      next: () => {},
      error: (err) => {
        console.error('Error', err);
        t.status = estadoAnterior;
        alert('No se pudo cambiar el estado de la tarea');
      }
    });
  }

  reabrirTarea() {
    const t = this.task();
    if (!t) return;
    if (confirm(`¿Estás seguro de que quieres reabrir la tarea "${t.title}"?`)) {
      this.cambiarEstado('IN_PROGRESS');
    }
  }
}
