import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

// =============================================================================
// [IONIC 9 - CLASES 2, 3, 5 Y 6] LISTADO DE PROYECTOS CON SEARCHBAR Y CACHÉ
// =============================================================================
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonButtons,
  IonMenuButton,
  IonSpinner,
  IonText
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  addOutline,
  trashOutline,
  createOutline,
  folderOpenOutline,
  desktopOutline,
  cloudOfflineOutline
} from 'ionicons/icons';

import { ProjectService } from '../../../services/project.service';
import { IonicStorageService } from '../../services/ionic-storage.service';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-mobile-projects',
  standalone: true,
  imports: [
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonBadge,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent,
    IonButtons,
    IonMenuButton,
    IonSpinner,
    IonText
  ],
  templateUrl: './mobile-projects.component.html',
  styleUrls: ['./mobile-projects.component.css']
})
export class MobileProjectsComponent implements OnInit {
  private projectService = inject(ProjectService);
  readonly storage = inject(IonicStorageService);
  private router = inject(Router);

  // [CLASE 5] Los 3 estados de la UI modelados con Signals
  projects = signal<Project[]>([]);
  searchTerm = signal<string>('');
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  filteredProjects = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.projects();
    return this.projects().filter(p =>
      p.name.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term))
    );
  });

  constructor() {
    addIcons({
      addOutline,
      trashOutline,
      createOutline,
      folderOpenOutline,
      desktopOutline,
      cloudOfflineOutline
    });
  }

  ngOnInit(): void {
    this.cargarProyectos();
  }

  // [CLASES 5 Y 6] Petición con catchError + finalize + persistencia en Preferences
  async cargarProyectos(event?: any): Promise<void> {
    if (!event) {
      this.loading.set(true);
    }
    this.error.set(null);

    if (await this.storage.isOnline()) {
      this.projectService.getAll().pipe(
        catchError(() => {
          this.error.set('Modo Offline: Mostrando proyectos guardados en @capacitor/preferences.');
          return of(null);
        }),
        finalize(() => {
          this.loading.set(false);
          if (event) event.target.complete();
        })
      ).subscribe(async (data) => {
        if (data !== null) {
          this.projects.set(data);
          await this.storage.saveProjects(data);
        } else {
          this.projects.set(await this.storage.loadProjects());
        }
      });
    } else {
      this.error.set('Sin conexión: proyectos recuperados desde almacenamiento nativo.');
      this.projects.set(await this.storage.loadProjects());
      this.loading.set(false);
      if (event) event.target.complete();
    }
  }

  onSearch(event: any): void {
    this.searchTerm.set(event.target.value || '');
  }

  irAVersionEscritorio(): void {
    this.router.navigate(['/projects']);
  }

  eliminarProyecto(p: Project, event: Event): void {
    event.stopPropagation();
    if (!p.id) return;
    if (confirm(`¿Eliminar proyecto "${p.name}"?`)) {
      this.projectService.delete(p.id).subscribe({
        next: async () => {
          this.projects.update(ps => ps.filter(proj => proj.id !== p.id));
          await this.storage.saveProjects(this.projects());
        }
      });
    }
  }
}
