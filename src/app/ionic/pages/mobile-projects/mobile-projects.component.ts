import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

// [IONIC - AVANZADA 3] Componentes de Ionic para listado móvil
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
  IonButtons
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  addOutline,
  trashOutline,
  createOutline,
  folderOpenOutline,
  desktopOutline
} from 'ionicons/icons';

import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-mobile-projects',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // [IONIC] Componentes registrados
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
    IonButtons
  ],
  templateUrl: './mobile-projects.component.html',
  styleUrls: ['./mobile-projects.component.css']
})
export class MobileProjectsComponent implements OnInit {
  private projectService = inject(ProjectService);
  private router = inject(Router);

  projects = signal<Project[]>([]);
  searchTerm = signal<string>('');
  loading = signal<boolean>(true);

  // [SIGNALS] Filtrado reactivo en tiempo real al escribir en ion-searchbar
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
      desktopOutline
    });
  }

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos(event?: any): void {
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.loading.set(false);
        if (event) event.target.complete();
      },
      error: () => {
        this.loading.set(false);
        if (event) event.target.complete();
      }
    });
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
        next: () => {
          this.projects.update(ps => ps.filter(proj => proj.id !== p.id));
        }
      });
    }
  }
}
