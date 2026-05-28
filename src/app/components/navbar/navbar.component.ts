import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { LucideSearch, LucideX } from '@lucide/angular';
import { SearchService } from '../../services/search.service';
import { Task } from '../../models/task.model';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideSearch, LucideX],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  searchQuery = '';
  results: { projects: Project[]; tasks: Task[] } = { projects: [], tasks: [] };
  showDropdown = false;
  isLoading = false;

  private searchSubject = new Subject<string>();
  private destroyed$ = new Subject<void>();

  get hasResults(): boolean {
    return this.results.projects.length > 0 || this.results.tasks.length > 0;
  }

  get totalResults(): number {
    return this.results.projects.length + this.results.tasks.length;
  }

  get hasSearchTerm(): boolean {
    return this.searchQuery.trim().length > 0;
  }

  constructor(
    private searchService: SearchService,
    private router: Router,
    private elRef: ElementRef
  ) {}

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(120),
      distinctUntilChanged(),
      switchMap(query => {
        const q = query.trim();

        if (!q) {
          this.results = { projects: [], tasks: [] };
          this.showDropdown = false;
          this.isLoading = false;
          return of({ projects: [], tasks: [] });
        }

        this.isLoading = true;
        this.showDropdown = true;
        return this.searchService.search(q);
      }),
      takeUntil(this.destroyed$)
    ).subscribe({
      next: results => {
        this.results = results;
        this.isLoading = false;
        this.showDropdown = true;
      },
      error: () => {
        this.isLoading = false;
        this.showDropdown = false;
      }
    });
  }

  onSearchInput() {
    this.searchSubject.next(this.searchQuery);
  }

  goToProject(id: number) {
    this.router.navigate(['/projects', id]);
    this.closeDropdown();
  }

  goToTask(id?: number) {
    if (id == null) return;
    this.router.navigate(['/tasks', id]);
    this.closeDropdown();
  }

  closeDropdown() {
    this.showDropdown = false;
    this.searchQuery = '';
    this.results = { projects: [], tasks: [] };
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      TODO: 'status-todo',
      IN_PROGRESS: 'status-progress',
      DONE: 'status-done',
      PLANNED: 'status-todo',
      ACTIVE: 'status-active',
      CLOSED: 'status-done'
    };

    return map[status] ?? 'status-todo';
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      TODO: 'Por hacer',
      IN_PROGRESS: 'En progreso',
      DONE: 'Hecha',
      PLANNED: 'Planificado',
      ACTIVE: 'Activo',
      CLOSED: 'Cerrado'
    };

    return map[status] ?? status;
  }

  trackById(index: number, item: Project | Task): number {
    return item.id ?? index;
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeDropdown();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
