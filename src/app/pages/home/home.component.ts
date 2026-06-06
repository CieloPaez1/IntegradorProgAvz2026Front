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
import { LucideAlertTriangle, LucideBriefcase, LucidePieChart, LucidePlus, LucideChevronDown, LucideCalendar, LucideChevronLeft, LucideChevronRight } from '@lucide/angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TaskStatusPipe, ProjectStatusPipe, LucideAlertTriangle, LucideBriefcase, LucidePieChart, LucidePlus, LucideChevronDown, LucideCalendar, LucideChevronLeft, LucideChevronRight],
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

  // --- CALENDARIO MENSUAL ---
  private getTodayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  tareasConVencimiento = computed(() => {
    return this.tasks().map(t => {
      const p = this.projects().find(proj => proj.id === t.projectId);
      return {
        ...t,
        dueDate: p?.endDate || '9999-12-31',
        projectName: p?.name || 'Sin Proyecto'
      };
    }).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  });

  currentMonth = signal<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  mesActualNombre = computed(() => {
    const formatter = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
    const text = formatter.format(this.currentMonth());
    return text.charAt(0).toUpperCase() + text.slice(1);
  });

  calendarDays = computed(() => {
    const year = this.currentMonth().getFullYear();
    const month = this.currentMonth().getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1)); // Lunes como primer día
    
    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (7 - endDate.getDay() === 7 ? 0 : 7 - endDate.getDay()));
    
    const days: any[] = [];
    const todayStr = this.getTodayStr();
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const dayTasks = this.tareasConVencimiento().filter(t => t.dueDate === dateStr).map(t => {
        let colorClass = 'blue';
        if (t.status === 'DONE') colorClass = 'green';
        else if (t.dueDate < todayStr) colorClass = 'red';
        else if (t.dueDate === todayStr) colorClass = 'yellow';
        
        return {
          id: t.id,
          title: t.title,
          projectName: t.projectName,
          status: t.status,
          dueDate: t.dueDate,
          colorClass
        };
      });

      days.push({
        date: new Date(currentDate),
        dayNumber: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: dateStr === todayStr,
        tasks: dayTasks
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  });

  prevMonth() {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth() {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }
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
