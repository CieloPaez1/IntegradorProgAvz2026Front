import { Component, inject, signal, computed, OnInit, effect, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { TaskStatusPipe } from '../../pipes/task-status.pipe';
import { ProjectStatusPipe } from '../../pipes/project-status.pipe';
import { LucideAlertTriangle, LucideBriefcase, LucidePieChart, LucidePlus, LucideChevronDown, LucideCalendar } from '@lucide/angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TaskStatusPipe, ProjectStatusPipe, LucideAlertTriangle, LucideBriefcase, LucidePieChart, LucidePlus, LucideChevronDown, LucideCalendar],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit {

  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  projects = signal<Project[]>([]);
  tasks = signal<Task[]>([]);

  attentionRequiredTasks = computed(() => {
    return this.tasks().filter(t => t.status === 'TODO' && (t.estimateHours || 0) >= 10);
  });

  @ViewChild('projectChart') projectChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('taskChart') taskChartRef!: ElementRef<HTMLCanvasElement>;

  private projectChartInst: Chart | null = null;
  private taskChartInst: Chart | null = null;

  activeDropdownId = signal<string | null>(null);

  constructor() {
    effect(() => {
      const pData = [this.proyectosPlanificados(), this.proyectosEnProceso(), this.proyectosTerminados()];
      const tData = [this.tareasPendientes(), this.tareasEnProgreso(), this.tareasCompletadas()];
      
      if (this.projectChartInst) {
        this.projectChartInst.data.datasets[0].data = pData;
        this.projectChartInst.update();
      }
      if (this.taskChartInst) {
        this.taskChartInst.data.datasets[0].data = tData;
        this.taskChartInst.update();
      }
    });
  }

  ngOnInit(): void {
    this.projectService.getAll().subscribe({
      next: (data) => this.projects.set(data),
      error: () => this.projects.set([])
    });
    this.taskService.getAll().subscribe({
      next: (data) => this.tasks.set(data),
      error: () => this.tasks.set([])
    });
  }

  totalProyectos = computed(() => this.projects().length);
  proyectosPlanificados = computed(() => this.projects().filter(p => p.status === 'PLANNED').length);
  proyectosEnProceso = computed(() => this.projects().filter(p => p.status === 'ACTIVE').length);
  proyectosTerminados = computed(() => this.projects().filter(p => p.status === 'CLOSED').length);
  porcentajeProyectosTerminados = computed(() => this.percentage(this.proyectosTerminados(), this.totalProyectos()));

  totalTareas = computed(() => this.tasks().length);
  tareasEnProgreso = computed(() => this.tasks().filter(t => t.status === 'IN_PROGRESS').length);
  tareasCompletadas = computed(() => this.tasks().filter(t => t.status === 'DONE').length);
  tareasPendientes = computed(() => this.tasks().filter(t => t.status === 'TODO').length);

  // --- CALENDARIO DE VENCIMIENTOS ---
  private getTodayStr(): string {
    return new Date().toISOString().split('T')[0];
  }
  private getTomorrowStr(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }
  private getNextWeekStr(): string {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  }

  tareasConVencimiento = computed(() => {
    return this.tasks().map(t => {
      // Usamos la fecha de fin del proyecto como vencimiento de la tarea
      const p = this.projects().find(proj => proj.id === t.projectId);
      return {
        ...t,
        dueDate: p?.endDate || '9999-12-31',
        projectName: p?.name || 'Sin Proyecto'
      };
    }).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  });

  tareasVencidas = computed(() => {
    const today = this.getTodayStr();
    return this.tareasConVencimiento().filter(t => t.dueDate < today && t.status !== 'DONE');
  });

  tareasVenceHoy = computed(() => {
    const today = this.getTodayStr();
    return this.tareasConVencimiento().filter(t => t.dueDate === today && t.status !== 'DONE');
  });

  tareasVenceManana = computed(() => {
    const tomorrow = this.getTomorrowStr();
    return this.tareasConVencimiento().filter(t => t.dueDate === tomorrow && t.status !== 'DONE');
  });

  tareasProximaSemana = computed(() => {
    const tomorrow = this.getTomorrowStr();
    const nextWeek = this.getNextWeekStr();
    return this.tareasConVencimiento().filter(t => t.dueDate > tomorrow && t.dueDate <= nextWeek && t.status !== 'DONE');
  });

  tareasCompletadasRecientes = computed(() => {
    return this.tareasConVencimiento().filter(t => t.status === 'DONE').slice(0, 5);
  });
  // ----------------------------------

  porcentajeTareasCompletadas = computed(() => this.percentage(this.tareasCompletadas(), this.totalTareas()));

  ngAfterViewInit() {
    this.initCharts();
  }

  private initCharts() {
    setTimeout(() => {
      if (this.projectChartRef?.nativeElement) {
        this.projectChartInst = new Chart(this.projectChartRef.nativeElement, {
          type: 'doughnut',
          data: {
            labels: ['Planificados', 'En proceso', 'Terminados'],
            datasets: [{
              data: [this.proyectosPlanificados(), this.proyectosEnProceso(), this.proyectosTerminados()],
              backgroundColor: ['#fef3c7', '#dbeafe', '#dcfce7'],
              hoverBackgroundColor: ['#fde68a', '#bfdbfe', '#bbf7d0'],
              borderWidth: 0
            }]
          },
          options: {
            cutout: '75%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: {
              callbacks: {
                label: (context: any) => ` ${context.label}: ${context.raw}`
              }
            } }
          }
        });
      }

      if (this.taskChartRef?.nativeElement) {
        this.taskChartInst = new Chart(this.taskChartRef.nativeElement, {
          type: 'doughnut',
          data: {
            labels: ['Por hacer', 'En proceso', 'Hechas'],
            datasets: [{
              data: [this.tareasPendientes(), this.tareasEnProgreso(), this.tareasCompletadas()],
              backgroundColor: ['#fef3c7', '#dbeafe', '#dcfce7'],
              hoverBackgroundColor: ['#fde68a', '#bfdbfe', '#bbf7d0'],
              borderWidth: 0
            }]
          },
          options: {
            cutout: '75%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: {
              callbacks: {
                label: (context: any) => ` ${context.label}: ${context.raw}`
              }
            } }
          }
        });
      }
    }, 100);
  }

  private percentage(value: number, total: number): number {
    return total === 0 ? 0 : Math.round((value / total) * 100);
  }

  toggleDropdown(event: Event, id: string) {
    event.stopPropagation();
    if (this.activeDropdownId() === id) {
      this.activeDropdownId.set(null);
    } else {
      this.activeDropdownId.set(id);
    }
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.activeDropdownId.set(null);
  }

  updateProjectStatus(project: Project, nextStatus: 'PLANNED' | 'ACTIVE' | 'CLOSED') {
    if (!project.id) return;
    this.activeDropdownId.set(null);
    
    // Guardamos estado anterior para rollback
    const oldProjects = [...this.projects()];
    const updatedProject = { ...project, status: nextStatus };
    
    // Optimistic Update
    this.projects.update(ps => ps.map(p => p.id === project.id ? updatedProject : p));

    this.projectService.update(project.id, updatedProject).subscribe({
      error: (err) => {
        console.error('Error updating project status', err);
        // Rollback on error
        this.projects.set(oldProjects);
      }
    });
  }

  updateTaskStatus(task: Task, nextStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') {
    if (!task.id || !task.projectId) return;
    this.activeDropdownId.set(null);

    // Guardamos estado anterior para rollback
    const oldTasks = [...this.tasks()];
    const updatedTask = { ...task, status: nextStatus };

    // Optimistic Update
    this.tasks.update(ts => ts.map(t => t.id === task.id ? updatedTask : t));

    this.taskService.update(task.projectId, task.id, updatedTask).subscribe({
      error: (err) => {
        console.error('Error updating task status', err);
        // Rollback on error
        this.tasks.set(oldTasks);
      }
    });
  }
}
