import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';
import { Task } from '../../models/task.model';
import { Project } from '../../models/project.model';

// =============================================================================
// [CAPACITOR 8 - CLASE 6: PERSISTENCIA LOCAL Y ESTRATEGIA OFFLINE]
// Marco Teórico de Cátedra:
// 1. Panorama de almacenamiento en dispositivo:
//    - Memoria (Signals/variables): Se pierde al cerrar la app.
//    - localStorage (Web): Síncrono y volátil en contenedores móviles.
//    - @capacitor/preferences (Nativo Clave-Valor): Persiste en disco nativo
//      (SharedPreferences en Android / UserDefaults en iOS). Sobrevive al
//      cierre de la app y reinicio del teléfono. Ideal para cachés simples y MVP.
//    - SQLite (@capacitor-community/sqlite): Base relacional para SQL complejo.
//
// 2. Clave-Valor con JSON:
//    Preferences guarda strings bajo una clave ("caja etiquetada"). Por eso
//    serializamos con JSON.stringify() al guardar y JSON.parse() al leer.
//
// 3. Estrategia Offline (Network-First con Fallback):
//    Intentamos consultar la API REST primero; si hay éxito, actualizamos la
//    caché en Preferences. Si no hay conexión (@capacitor/network) o la red
//    falla, devolvemos los datos cacheados en disco para que el usuario nunca
//    vea una pantalla rota o vacía.
// =============================================================================
@Injectable({
  providedIn: 'root'
})
export class IonicStorageService {
  private readonly TASKS_KEY = 'tasks_cache';
  private readonly PROJECTS_KEY = 'projects_cache';

  // Signal reactivo para mostrar un aviso visual cuando estamos usando datos offline
  readonly usingOfflineCache = signal<boolean>(false);
  readonly networkConnected = signal<boolean>(true);

  constructor() {
    // [CLASE 6] Escuchamos cambios de conectividad en tiempo real con @capacitor/network
    Network.addListener('networkStatusChange', status => {
      this.networkConnected.set(status.connected);
    });
  }

  // [CLASE 6 - EJERCICIO 19] Guardar tareas en el almacenamiento nativo
  async saveTasks(tasks: Task[]): Promise<void> {
    await Preferences.set({
      key: this.TASKS_KEY,
      value: JSON.stringify(tasks)
    });
    this.usingOfflineCache.set(false);
  }

  // [CLASE 6 - EJERCICIO 19] Leer tareas cacheadas desde disco
  async loadTasks(): Promise<Task[]> {
    const { value } = await Preferences.get({ key: this.TASKS_KEY });
    this.usingOfflineCache.set(true);
    return value ? JSON.parse(value) : [];
  }

  // Guardar proyectos en el almacenamiento nativo
  async saveProjects(projects: Project[]): Promise<void> {
    await Preferences.set({
      key: this.PROJECTS_KEY,
      value: JSON.stringify(projects)
    });
  }

  // Leer proyectos cacheados desde disco
  async loadProjects(): Promise<Project[]> {
    const { value } = await Preferences.get({ key: this.PROJECTS_KEY });
    this.usingOfflineCache.set(true);
    return value ? JSON.parse(value) : [];
  }

  // [CLASE 6 - EJERCICIO 19] Consultar estado actual de red con @capacitor/network
  async isOnline(): Promise<boolean> {
    try {
      const status = await Network.getStatus();
      this.networkConnected.set(status.connected);
      return status.connected;
    } catch {
      return navigator.onLine;
    }
  }
}
