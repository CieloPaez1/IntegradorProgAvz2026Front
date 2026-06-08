import { Injectable, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark' | 'minimal' | 'cyberpunk' | 'ocean' | 'sunset' | 'forest' | 'crimson';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public readonly currentTheme = signal<AppTheme>('light');

  public readonly availableThemes: { id: AppTheme, name: string, color: string }[] = [
    { id: 'light', name: 'Claro (Framer)', color: '#fcfcfd' },
    { id: 'dark', name: 'Oscuro Profundo', color: '#05050a' },
    { id: 'minimal', name: 'Minimalista Clásico', color: '#18181b' },
    { id: 'cyberpunk', name: 'Cyberpunk Neón', color: '#090014' },
    { id: 'ocean', name: 'Océano', color: '#0f172a' },
    { id: 'sunset', name: 'Atardecer', color: '#fff1f2' },
    { id: 'forest', name: 'Bosque', color: '#f0fdf4' },
    { id: 'crimson', name: 'Rojo y Negro', color: '#7f1d1d' }
  ];

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    const savedTheme = localStorage.getItem('app-theme') as AppTheme;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme && this.availableThemes.find(t => t.id === savedTheme)) {
      this.setTheme(savedTheme);
    } else if (prefersDark) {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
  }

  public setTheme(theme: AppTheme) {
    this.currentTheme.set(theme);
    
    // Removemos cualquier tema previo
    document.documentElement.removeAttribute('data-theme');
    
    // Si no es el tema light por defecto, lo aplicamos
    if (theme !== 'light') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    
    localStorage.setItem('app-theme', theme);
  }
}
