import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private tasksUrl = `${environment.apiUrl}/tasks`;

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Error desconocido';
    if (error.status === 0) message = 'No se pudo conectar al servidor.';
    else if (error.status === 400) message = error.error?.message ?? 'Datos inválidos.';
    else if (error.status === 404) message = 'Tarea no encontrada.';
    else if (error.status === 409) message = error.error?.message ?? 'Conflicto.';
    else if (error.status === 500) message = error.error?.message ?? 'Error interno del servidor.';
    
    return throwError(() => new Error(message));
  }
}
