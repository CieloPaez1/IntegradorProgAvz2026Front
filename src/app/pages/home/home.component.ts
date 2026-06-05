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
import { LucideAlertTriangle, LucideBriefcase, LucidePieChart, LucidePlus } from '@lucide/angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TaskStatusPipe, ProjectStatusPipe, LucideAlertTriangle, LucideBriefcase, LucidePieChart, LucidePlus],
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
}
