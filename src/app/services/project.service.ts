import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/projects';

  create(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Error desconocido';

    if (error.status === 400) {
      message = 'Datos inválidos. Revisá los campos del formulario.';
    } else if (error.status === 404) {
      message = 'Proyecto no encontrado.';
    } else if (error.status === 409) {
      message = error.error?.message ?? 'Conflicto: el recurso ya existe o tiene dependencias.';
    } else if (error.status === 500) {
      message = 'Error interno del servidor. Intentá más tarde.';
    }

    return throwError(() => new Error(message));
  }
}
