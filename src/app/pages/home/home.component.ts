import { Component, inject, signal, computed, OnInit, effect, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { LucideAlertTriangle, LucideFilter } from '@lucide/angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TaskStatusPipe, ProjectStatusPipe, LucideAlertTriangle, LucideFilter],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit {

  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  rawProjects = signal<Project[]>([]);
  rawTasks = signal<Task[]>([]);
  
  myViewMode = signal<boolean>(false);

  projects = computed(() => {
    if (this.myViewMode()) {
      const myProjectIds = new Set(this.rawTasks().filter(t => t.assignee === 'Usuario').map(t => t.projectId));
      return this.rawProjects().filter(p => p.id && myProjectIds.has(p.id));
    }
    return this.rawProjects();
  });

  tasks = computed(() => {
    if (this.myViewMode()) {
      return this.rawTasks().filter(t => t.assignee === 'Usuario');
    }
    return this.rawTasks();
  });

  attentionRequiredTasks = computed(() => {
    return this.tasks().filter(t => t.status === 'TODO' && (t.estimateHours || 0) >= 10);
  });

  toggleViewMode() {
    this.myViewMode.update(v => !v);
  }

  @ViewChild('projectChart') projectChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('taskChart') taskChartRef!: ElementRef<HTMLCanvasElement>;

  private projectChartInst: Chart | null = null;
  private taskChartInst: Chart | null = null;

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
      next: (data) => this.rawProjects.set(data),
      error: () => this.rawProjects.set([])
    });
    this.taskService.getAll().subscribe({
      next: (data) => this.rawTasks.set(data),
      error: () => this.rawTasks.set([])
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
  porcentajeTareasCompletadas = computed(() => this.percentage(this.tareasCompletadas(), this.totalTareas()));

  ngAfterViewInit() {
    this.initCharts();
  }

  private initCharts() {
    if (this.projectChartRef) {
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
              label: (context) => ` ${context.label}: ${context.raw}`
            }
          } }
        }
      });
    }

    if (this.taskChartRef) {
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
              label: (context) => ` ${context.label}: ${context.raw}`
            }
          } }
        }
      });
    }
  }

  private percentage(value: number, total: number): number {
    return total === 0 ? 0 : Math.round((value / total) * 100);
  }
}
