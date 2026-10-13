import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
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

  // Signals para estado reactivo
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
      catchError((error: HttpErrorResponse) => {
        // Fallback adaptativo: Si el backend aún no implementa el endpoint /auth (404 o conexión)
        // se provee autenticación de prueba para no bloquear el desarrollo del front/Ionic
        if (error.status === 404 || error.status === 0) {
          return this.simulateLogin(credentials);
        }
        return throwError(() => this.formatError(error));
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.saveSession(res)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404 || error.status === 0) {
          return this.simulateRegister(data);
        }
        return throwError(() => this.formatError(error));
      })
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
      return new Error('No se pudo conectar con el servidor.');
    }
    if (error.status === 401) {
      return new Error('Email o contraseña incorrectos.');
    }
    if (error.status === 409) {
      return new Error('El correo electrónico ya está registrado.');
    }
    const msg = typeof error.error === 'string' ? error.error : error.error?.message;
    return new Error(msg || 'Ocurrió un error en la autenticación.');
  }

  // --- Fallback Demo para desarrollo hasta que el backend active Spring Security ---
  private simulateLogin(credentials: LoginRequest): Observable<AuthResponse> {
    if (credentials.password.length < 6) {
      return throwError(() => new Error('La contraseña debe tener al menos 6 caracteres.'));
    }

    const demoUser: User = {
      id: 1,
      name: credentials.email.split('@')[0].toUpperCase(),
      email: credentials.email,
      role: 'Administrador'
    };

    const mockResponse: AuthResponse = {
      token: `demo-jwt-token-${Date.now()}-${btoa(credentials.email)}`,
      user: demoUser
    };

    this.saveSession(mockResponse);
    return of(mockResponse);
  }

  private simulateRegister(data: RegisterRequest): Observable<AuthResponse> {
    const newUser: User = {
      id: Math.floor(Math.random() * 1000) + 2,
      name: data.name,
      email: data.email,
      role: 'Usuario'
    };

    const mockResponse: AuthResponse = {
      token: `demo-jwt-token-${Date.now()}-${btoa(data.email)}`,
      user: newUser
    };

    this.saveSession(mockResponse);
    return of(mockResponse);
  }
}
