import { Component, Input, OnInit, inject, signal } from '@angular/core';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonItem,
  IonLabel
} from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  timeOutline,
  personOutline,
  calendarOutline,
  locationOutline,
  mapOutline,
  imageOutline
} from 'ionicons/icons';
import { Task } from '../../../models/task.model';

// =============================================================================
// [IONIC 9 - CLASES 8, 9 Y 10: MODAL DE DETALLE CON FOTO NATIVA Y MAPA]
// Marco Teórico de Cátedra:
// - Clase 8 (Práctica guiada extra): Al abrir el detalle de la tarea,
//   `cargarFoto(task)` toma el nombre de archivo (`task.photo`) y reconstruye
//   su URI desde `Directory.Data` con `Filesystem.getUri()` + `Capacitor.convertFileSrc()`.
// - Clase 9 (Práctica guiada extra): `abrirEnMapas(task)` abre las coordenadas
//   GPS (`lat`, `lng`) en Google Maps nativo usando `window.open(url, '_system')`.
// - Clase 10 (Patrón Controller en Overlays): El componente modal se cierra
//   invocando `inject(ModalController).dismiss()`.
// =============================================================================
@Component({
  selector: 'app-mobile-task-detail-modal',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonBadge,
    IonIcon,
    IonItem,
    IonLabel
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Detalle de Tarea</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrar()">
            <ion-icon slot="icon-only" name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      @if (task) {
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>
              Tarea #{{ task.id || 'Local' }}
            </ion-card-subtitle>
            <ion-card-title>{{ task.title }}</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-item lines="full">
              <ion-icon name="person-outline" slot="start" color="primary"></ion-icon>
              <ion-label>
                <h3>Responsable</h3>
                <p>{{ task.assignee || 'Sin asignar' }}</p>
              </ion-label>
            </ion-item>

            <ion-item lines="full">
              <ion-icon name="time-outline" slot="start" color="warning"></ion-icon>
              <ion-label>
                <h3>Estimación</h3>
                <p>{{ task.estimateHours }} horas</p>
              </ion-label>
              <ion-badge
                slot="end"
                [color]="task.status === 'DONE' ? 'success' : (task.status === 'IN_PROGRESS' ? 'primary' : 'warning')">
                {{ task.status === 'DONE' ? 'Completada' : (task.status === 'IN_PROGRESS' ? 'En Curso' : 'Pendiente') }}
              </ion-badge>
            </ion-item>

            @if (task.dueDate) {
              <ion-item lines="full">
                <ion-icon name="calendar-outline" slot="start" color="tertiary"></ion-icon>
                <ion-label>
                  <h3>Fecha de Vencimiento</h3>
                  <p>{{ task.dueDate }}</p>
                </ion-label>
              </ion-item>
            }

            <!-- [CLASE 8 - PRÁCTICA EXTRA] Reconstrucción de foto desde Directory.Data -->
            @if (photoUrl()) {
              <div style="margin-top: 14px; text-align: center;">
                <img
                  [src]="photoUrl()"
                  alt="Foto adjunta a la tarea"
                  style="width: 100%; max-height: 220px; object-fit: cover; border-radius: 12px;" />
                <p style="font-size: 0.78rem; margin-top: 4px; opacity: 0.75;">
                  Archivo nativo: {{ task.photo }}
                </p>
              </div>
            }

            <!-- [CLASE 9 - PRÁCTICA EXTRA] Coordenadas GPS y botón "Abrir en mapas" -->
            @if (task.lat !== undefined && task.lng !== undefined) {
              <ion-item lines="none" style="margin-top: 10px;">
                <ion-icon name="location-outline" slot="start" color="tertiary"></ion-icon>
                <ion-label>
                  <h3>Ubicación GPS</h3>
                  <p>{{ task.lat }}, {{ task.lng }}</p>
                </ion-label>
              </ion-item>
              <ion-button
                expand="block"
                fill="outline"
                color="tertiary"
                (click)="abrirEnMapas(task)">
                <ion-icon name="map-outline" slot="start"></ion-icon>
                Abrir en Mapas
              </ion-button>
            }
          </ion-card-content>
        </ion-card>

        <ion-button expand="block" color="primary" (click)="cerrar()">
          Cerrar Detalle
        </ion-button>
      }
    </ion-content>
  `
})
export class MobileTaskDetailModalComponent implements OnInit {
  private modalCtrl = inject(ModalController);

  @Input() task!: Task;
  photoUrl = signal<string | null>(null);

  constructor() {
    addIcons({
      closeOutline,
      timeOutline,
      personOutline,
      calendarOutline,
      locationOutline,
      mapOutline,
      imageOutline
    });
  }

  ngOnInit(): void {
    if (this.task) {
      this.cargarFoto(this.task);
    }
  }

  // ===========================================================================
  // [CLASE 8 - PRÁCTICA GUIADA EXTRA] RECONSTRUIR URL DESDE DIRECTORY.DATA
  // ===========================================================================
  async cargarFoto(task: Task): Promise<void> {
    if (task.photoPreview) {
      this.photoUrl.set(task.photoPreview);
      return;
    }
    if (!task.photo) return;
    try {
      const uri = await Filesystem.getUri({
        path: task.photo,
        directory: Directory.Data
      });
      this.photoUrl.set(Capacitor.convertFileSrc(uri.uri));
    } catch {
      // Si el archivo no existe en este entorno, se omite sin romper la vista
    }
  }

  // ===========================================================================
  // [CLASE 9 - PRÁCTICA GUIADA EXTRA] ABRIR UBICACIÓN EN GOOGLE MAPS NATIVO
  // ===========================================================================
  abrirEnMapas(task: Task): void {
    const url = `https://www.google.com/maps?q=${task.lat},${task.lng}`;
    window.open(url, '_system');
  }

  // [CLASE 10] Cerrar overlay mediante ModalController.dismiss()
  cerrar(): void {
    this.modalCtrl.dismiss();
  }
}
