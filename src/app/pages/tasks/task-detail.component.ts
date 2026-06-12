import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskStatusPipe } from '../../pipes/task-status.pipe';
import { LucideArrowLeft, LucideEdit, LucideTrash2 } from '@lucide/angular';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TaskStatusPipe, LucideArrowLeft, LucideTrash2],
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
}
