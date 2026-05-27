import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/projects';
  private tasksUrl = 'http://localhost:8080/tasks';

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl).pipe(
      catchError(this.handleError)
    );
  }

  filter(minEstimate?: number, assignee?: string): Observable<Task[]> {
    let params = new HttpParams();
    if (minEstimate) params = params.set('minEstimate', minEstimate.toString());
    if (assignee) params = params.set('assignee', assignee);

    return this.http.get<Task[]>(this.tasksUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  create(projectId: number, task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/${projectId}/tasks`, task).pipe(
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
    console.error('HTTP Error:', error);
    return throwError(() => new Error(message));
  }
}