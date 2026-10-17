import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// =============================================================================
// [IONIC 9 - CLASE 4: FORMULARIOS REACTIVOS CON CONTROLES NATIVOS DE IONIC]
// Marco Teórico de Cátedra:
// - Puente ControlValueAccessor: Los Web Components de Ionic (ion-input,
//   ion-select, ion-datetime, ion-toggle) ya implementan la interfaz
//   ControlValueAccessor de Angular, permitiendo enlazar [formControlName]
//   directamente sin adaptadores manuales.
// - Modelo de estado de un control: valid/invalid, touched/untouched, dirty/pristine.
//   Regla de oro UX: Mostrar <ion-note color="danger"> recién cuando
//   (control.touched && control.invalid). Al enviar, markAllAsTouched() fuerza
//   la visualización de todos los errores pendientes.
// =============================================================================
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonToggle,
  IonButton,
  IonNote,
  IonIcon,
  IonSpinner
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { saveOutline, arrowBackOutline } from 'ionicons/icons';

import { TaskService } from '../../../services/task.service';
import { ProjectService } from '../../../services/project.service';
import { IonicStorageService } from '../../services/ionic-storage.service';
import { Project } from '../../../models/project.model';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-mobile-task-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    // [CLASE 4] Importación selectiva (tree-shaking) de controles de formulario Ionic
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonToggle,
    IonButton,
    IonNote,
    IonIcon,
    IonSpinner
  ],
  templateUrl: './mobile-task-form.component.html',
  styleUrls: ['./mobile-task-form.component.css']
})
export class MobileTaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private storageService = inject(IonicStorageService);
  private router = inject(Router);

  projects = signal<Project[]>([]);
  saving = signal<boolean>(false);

  // ===========================================================================
  // [CLASE 4 - EJERCICIO GUIADO] DEFINICIÓN DEL FORMULARIO REACTIVO TIPADO
  // ===========================================================================
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    projectId: [1, [Validators.required]],
    assignee: [''],
    estimateHours: [2, [Validators.required, Validators.min(1)]],
    dueDate: [new Date().toISOString(), Validators.required],
    priority: ['media', Validators.required],
    done: [false]
  });

  constructor() {
    addIcons({ saveOutline, arrowBackOutline });
  }

  ngOnInit(): void {
    this.projectService.getAll().subscribe({
      next: (projs) => {
        this.projects.set(projs);
        if (projs.length > 0 && projs[0].id) {
          this.form.patchValue({ projectId: projs[0].id });
        }
      },
      error: async () => {
        const cached = await this.storageService.loadProjects();
        this.projects.set(cached);
      }
    });
  }

  // [CLASE 4] Getter tipado para acceder al control desde el template HTML sin errores de tipo
  get title() {
    return this.form.controls.title;
  }

  get estimateHours() {
    return this.form.controls.estimateHours;
  }

  // [CLASE 4] Envío con validación y markAllAsTouched()
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const val = this.form.getRawValue();
    const projectId = Number(val.projectId) || 1;

    const nuevaTarea: Task = {
      title: val.title || '',
      assignee: val.assignee || 'Sin asignar',
      estimateHours: Number(val.estimateHours) || 1,
      status: val.done ? 'DONE' : 'TODO',
      projectId
    };

    this.taskService.create(projectId, nuevaTarea).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/mobile/tasks']);
      },
      error: async () => {
        // Fallback offline: guardamos también en la caché local de Preferences
        const actuales = await this.storageService.loadTasks();
        actuales.unshift({ ...nuevaTarea, id: Date.now() });
        await this.storageService.saveTasks(actuales);
        this.saving.set(false);
        this.router.navigate(['/mobile/tasks']);
      }
    });
  }
}
