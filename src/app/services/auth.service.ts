import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

const TOKEN_KEY = 'app_auth_token';
const USER_KEY = 'app_auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  // Signals para estado reactivo de la sesión
  readonly currentUser = signal<User | null>(this.loadStoredUser());
  readonly token = signal<string | null>(this.loadStoredToken());
  readonly isAuthenticated = computed(() => !!this.token());

  private loadStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private loadStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    this.token.set(response.token);
    this.currentUser.set(response.user);
  }

  private clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.token.set(null);
    this.currentUser.set(null);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.saveSession(res)),
      catchError((error: HttpErrorResponse) => throwError(() => this.formatError(error)))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.saveSession(res)),
      catchError((error: HttpErrorResponse) => throwError(() => this.formatError(error)))
    );
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.token();
  }

  private formatError(error: HttpErrorResponse): Error {
    if (error.status === 0) {
      return new Error('No se pudo conectar con el servidor Backend (http://localhost:8080). Verificá que esté corriendo con npm.cmd run back.');
    }
    if (error.status === 401) {
      const msg = typeof error.error === 'string' && error.error ? error.error : 'Email o contraseña incorrectos.';
      return new Error(msg);
    }
    if (error.status === 409) {
      const msg = typeof error.error === 'string' && error.error ? error.error : 'El correo electrónico ya está registrado.';
      return new Error(msg);
    }
    const msg = typeof error.error === 'string' ? error.error : error.error?.message;
    return new Error(msg || 'Ocurrió un error en la autenticación.');
  }
}
