import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// =============================================================================
// [IONIC 9 - CLASES 4, 8 Y 9: FORMULARIOS REACTIVOS + PLUGINS NATIVOS CAPACITOR]
// Marco Teórico de Cátedra:
// - Clase 4 (Formularios Reactivos): Controles Ionic con ControlValueAccessor,
//   getters tipados, <ion-note color="danger"> al estar touched && invalid, y
//   markAllAsTouched() al enviar.
// - Clase 8 (Cámara y Sistema de Archivos):
//   * Camera.getPhoto() cruza el puente de Capacitor hacia Kotlin/Swift y
//     devuelve una Promesa con la imagen en Base64.
//   * Filesystem.writeFile() persiste el binario en Directory.Data (privado y
//     persistente de la app; a diferencia de Directory.Cache que el SO borra).
//   * Capacitor.convertFileSrc() traduce la URI file:// nativa a una URL segura
//     que el WebView puede renderizar en un <img>.
//   * Separar binario de metadatos: en el objeto Task guardamos solo el nombre
//     de archivo (`task-<timestamp>.jpeg`), no el Base64 completo.
// - Clase 9 (Geolocalización y Notificaciones Locales):
//   * Ciclo de vida de un permiso sensible: consultar/pedir con
//     requestPermissions() antes de usar el recurso y degradar con elegancia
//     si el usuario rechaza el permiso.
//   * LocalNotifications.schedule() programa avisos en el propio dispositivo
//     (sin servidor push FCM/APNs) usando un id numérico único.
// =============================================================================
import {
  ActionSheetController,
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
  IonSpinner,
  IonChip
} from '@ionic/angular';

import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';

import { addIcons } from 'ionicons';
import {
  saveOutline,
  arrowBackOutline,
  cameraOutline,
  imageOutline,
  locationOutline,
  notificationsOutline,
  closeOutline
} from 'ionicons/icons';

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
    IonSpinner,
    IonChip
  ],
  templateUrl: './mobile-task-form.component.html',
  styleUrls: ['./mobile-task-form.component.css']
})
export class MobileTaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private storageService = inject(IonicStorageService);
  private actionSheetCtrl = inject(ActionSheetController);
  private router = inject(Router);

  projects = signal<Project[]>([]);
  saving = signal<boolean>(false);

  // [CLASE 8] URL segura para previsualizar la foto en <img>
  photoUrl = signal<string | null>(null);
  // [CLASE 9] Estado informativo de ubicación y notificación
  locationStatus = signal<string | null>(null);

  // ===========================================================================
  // [CLASE 4, 8 Y 9] DEFINICIÓN DEL FORMULARIO REACTIVO TIPADO
  // Incluye metadatos de foto (Clase 8) y coordenadas lat/lng (Clase 9)
  // ===========================================================================
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    projectId: [1, [Validators.required]],
    assignee: [''],
    estimateHours: [2, [Validators.required, Validators.min(1)]],
    dueDate: [new Date(Date.now() + 60_000).toISOString(), Validators.required],
    priority: ['media', Validators.required],
    done: [false],
    photo: [''],
    lat: [null as number | null],
    lng: [null as number | null]
  });

  constructor() {
    addIcons({
      saveOutline,
      arrowBackOutline,
      cameraOutline,
      imageOutline,
      locationOutline,
      notificationsOutline,
      closeOutline
    });
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

  // [CLASE 4] Getters tipados para acceder a los controles desde el template HTML
  get title() {
    return this.form.controls.title;
  }

  get estimateHours() {
    return this.form.controls.estimateHours;
  }

  // ===========================================================================
  // [CLASE 8 - DESAFÍO OPCIONAL] ELEGIR ENTRE CÁMARA Y GALERÍA CON ACTION SHEET
  // ===========================================================================
  async elegirOrigenFoto(): Promise<void> {
    const sheet = await this.actionSheetCtrl.create({
      header: 'Adjuntar foto a la tarea',
      buttons: [
        {
          text: 'Tomar foto con la Cámara',
          icon: 'camera-outline',
          handler: () => {
            this.takePhoto(CameraSource.Camera);
          }
        },
        {
          text: 'Elegir desde la Galería',
          icon: 'image-outline',
          handler: () => {
            this.takePhoto(CameraSource.Photos);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });
    await sheet.present();
  }

  // ===========================================================================
  // [CLASE 8 - EJERCICIO GUIADO] CAPTURAR FOTO Y GUARDAR EN DIRECTORY.DATA
  // - Camera.getPhoto() obtiene la imagen en Base64.
  // - Filesystem.writeFile() persiste el binario en Directory.Data (persistente).
  // - Capacitor.convertFileSrc() convierte la ruta nativa para el WebView.
  // - En el formulario guardamos solo `fileName` (separar binario de metadatos).
  // ===========================================================================
  async takePhoto(source: CameraSource = CameraSource.Camera): Promise<void> {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source,
        quality: 80
      });

      if (!photo.base64String) return;

      const fileName = `task-${Date.now()}.jpeg`;
      await Filesystem.writeFile({
        path: fileName,
        data: photo.base64String,
        directory: Directory.Data
      });

      const savedFile = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Data
      });

      // En dispositivo nativo usamos convertFileSrc; en navegador mostramos el dataUrl
      if (Capacitor.isNativePlatform()) {
        this.photoUrl.set(Capacitor.convertFileSrc(savedFile.uri));
      } else {
        this.photoUrl.set(`data:image/jpeg;base64,${photo.base64String}`);
      }

      // Guardamos únicamente el nombre de archivo en los metadatos de la tarea
      this.form.patchValue({ photo: fileName });
    } catch {
      // Si el usuario cancela la cámara o rechaza el permiso, degradamos sin romper la app
    }
  }

  // ===========================================================================
  // [CLASE 9 - EJERCICIO GUIADO] GUARDAR UBICACIÓN GPS CON PERMISOS EXPLÍCITOS
  // ===========================================================================
  async guardarUbicacion(): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        const permiso = await Geolocation.requestPermissions();
        if (permiso.location !== 'granted') {
          this.locationStatus.set('Permiso de ubicación denegado por el usuario.');
          return;
        }
      }

      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 8000 });
      const lat = Number(pos.coords.latitude.toFixed(5));
      const lng = Number(pos.coords.longitude.toFixed(5));
      this.form.patchValue({ lat, lng });
      this.locationStatus.set(`Ubicación registrada: ${lat}, ${lng}`);
    } catch {
      this.locationStatus.set('No se pudo obtener el GPS (verificá permisos o ubicación simulada).');
    }
  }

  // ===========================================================================
  // [CLASE 9 - EJERCICIO GUIADO] PROGRAMAR NOTIFICACIÓN LOCAL DE VENCIMIENTO
  // - En Android 13+ (API 33) POST_NOTIFICATIONS requiere permiso en runtime.
  // - Cada notificación lleva un id numérico único para poder cancelarla luego.
  // ===========================================================================
  async programarNotificacion(task: Task): Promise<void> {
    try {
      const perm = await LocalNotifications.requestPermissions();
      if (perm.display !== 'granted') return;

      const rawDate = task.dueDate ? new Date(task.dueDate).getTime() : Date.now() + 60_000;
      // Si la fecha elegida ya pasó hoy, programamos a 1 minuto en el futuro para demostración en clase
      const targetTime = rawDate > Date.now() ? new Date(rawDate) : new Date(Date.now() + 60_000);

      await LocalNotifications.schedule({
        notifications: [
          {
            id: task.id ?? Math.floor(Date.now() % 2147483647),
            title: 'Tarea próxima a vencer',
            body: task.title,
            schedule: { at: targetTime }
          }
        ]
      });
    } catch {
      // En navegador web sin soporte nativo de LocalNotifications ignoramos silenciosamente
    }
  }

  // [CLASE 4, 8 Y 9] Envío con validación, markAllAsTouched() y programación de notificación
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const val = this.form.getRawValue();
    const projectId = Number(val.projectId) || 1;
    const dueDateStr = val.dueDate ? val.dueDate.split('T')[0] : undefined;

    const nuevaTarea: Task = {
      title: val.title || '',
      assignee: val.assignee || 'Sin asignar',
      estimateHours: Number(val.estimateHours) || 1,
      status: val.done ? 'DONE' : 'TODO',
      dueDate: dueDateStr,
      priority: (val.priority as 'baja' | 'media' | 'alta') || 'media',
      photo: val.photo || undefined,
      photoPreview: this.photoUrl() || undefined,
      lat: val.lat ?? undefined,
      lng: val.lng ?? undefined,
      projectId
    };

    this.taskService.create(projectId, nuevaTarea).subscribe({
      next: async (creada) => {
        const tareaFinal: Task = {
          ...nuevaTarea,
          ...creada,
          photo: nuevaTarea.photo,
          photoPreview: nuevaTarea.photoPreview,
          lat: nuevaTarea.lat,
          lng: nuevaTarea.lng
        };
        // Persistimos también los metadatos nativos en caché local
        const actuales = await this.storageService.loadTasks();
        actuales.unshift(tareaFinal);
        await this.storageService.saveTasks(actuales);

        // [CLASE 9] Programamos la notificación local inmediatamente tras crear la tarea
        await this.programarNotificacion(tareaFinal);

        this.saving.set(false);
        this.router.navigate(['/mobile/tasks']);
      },
      error: async () => {
        // Fallback offline: guardamos también en la caché local de Preferences
        const tareaOffline: Task = { ...nuevaTarea, id: Math.floor(Date.now() % 1000000) };
        const actuales = await this.storageService.loadTasks();
        actuales.unshift(tareaOffline);
        await this.storageService.saveTasks(actuales);
        await this.programarNotificacion(tareaOffline);

        this.saving.set(false);
        this.router.navigate(['/mobile/tasks']);
      }
    });
  }
}
