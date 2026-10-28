import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// =============================================================================
// [IONIC 9 - CLASE 4: FORMULARIO REACTIVO MÓVIL DE PROYECTO (CREAR Y EDITAR)]
// Pantalla 100% adaptada a móvil con controles nativos de Ionic (ion-input,
// ion-textarea, ion-select, ion-datetime, ion-note) para crear o editar un
// proyecto sin salir del entorno móvil de Ionic.
// =============================================================================
import {
  ToastController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonButton,
  IonNote,
  IonIcon,
  IonSpinner
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { saveOutline, briefcaseOutline } from 'ionicons/icons';

import { ProjectService } from '../../../services/project.service';
import { IonicStorageService } from '../../services/ionic-storage.service';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-mobile-project-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonButton,
    IonNote,
    IonIcon,
    IonSpinner
  ],
  templateUrl: './mobile-project-form.component.html',
  styleUrls: ['./mobile-project-form.component.css']
})
export class MobileProjectFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private storageService = inject(IonicStorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  editId = signal<number | null>(null);
  saving = signal<boolean>(false);
  serverError = signal<string | null>(null);

  // Fechas por defecto: hoy y +30 días
  private todayIso = new Date().toISOString().split('T')[0];
  private nextMonthIso = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    status: ['ACTIVE' as 'PLANNED' | 'ACTIVE' | 'CLOSED', [Validators.required]],
    startDate: [this.todayIso, [Validators.required]],
    endDate: [this.nextMonthIso, [Validators.required]]
  });

  constructor() {
    addIcons({ saveOutline, briefcaseOutline });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.editId.set(id);
      this.cargarProyectoParaEditar(id);
    }
  }

  get name() {
    return this.form.controls.name;
  }

  private cargarProyectoParaEditar(id: number): void {
    this.projectService.getById(id).subscribe({
      next: (proj) => {
        this.form.patchValue({
          name: proj.name,
          description: proj.description || '',
          status: proj.status,
          startDate: proj.startDate ? proj.startDate.split('T')[0] : this.todayIso,
          endDate: proj.endDate ? proj.endDate.split('T')[0] : this.nextMonthIso
        });
      },
      error: async () => {
        const cached = await this.storageService.loadProjects();
        const found = cached.find(p => p.id === id);
        if (found) {
          this.form.patchValue({
            name: found.name,
            description: found.description || '',
            status: found.status,
            startDate: found.startDate ? found.startDate.split('T')[0] : this.todayIso,
            endDate: found.endDate ? found.endDate.split('T')[0] : this.nextMonthIso
          });
        }
      }
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.getRawValue();
    const startStr = (val.startDate || this.todayIso).split('T')[0];
    const endStr = (val.endDate || this.nextMonthIso).split('T')[0];

    if (endStr < startStr) {
      this.serverError.set('La fecha de finalización no puede ser anterior a la fecha de inicio.');
      return;
    }

    this.saving.set(true);
    this.serverError.set(null);

    const payload: Project = {
      name: (val.name || '').trim(),
      description: (val.description || '').trim(),
      status: (val.status as 'PLANNED' | 'ACTIVE' | 'CLOSED') || 'ACTIVE',
      startDate: startStr,
      endDate: endStr
    };

    const id = this.editId();
    const request$ = id
      ? this.projectService.update(id, payload)
      : this.projectService.create(payload);

    request$.subscribe({
      next: async (saved) => {
        const toast = await this.toastCtrl.create({
          message: id ? 'Proyecto actualizado con éxito' : 'Proyecto creado con éxito',
          duration: 2000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();
        this.saving.set(false);
        this.router.navigate([id ? `/mobile/projects/${id}` : '/mobile/projects']);
      },
      error: async (err: Error) => {
        this.saving.set(false);
        this.serverError.set(err.message || 'No se pudo guardar el proyecto.');
      }
    });
  }
}
