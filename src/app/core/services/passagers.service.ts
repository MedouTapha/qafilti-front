import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environements/environment';

export interface Passager {
  id: number;
  nom: string;
  telephone: string;
  nniPassport?: string; // NNI ou Passport (alphanumeric)
}

@Injectable({ providedIn: 'root' })
export class PassagersService {
  private readonly http = inject(HttpClient);

  // Private state with signals
  private readonly _passagers = signal<Passager[]>([]);

  // Public readonly signals
  readonly passagers = this._passagers.asReadonly();
  readonly passagersCount = computed(() => this._passagers().length);

  constructor() {
    this.loadPassagers();
  }

  // Load data from API
  loadPassagers(): void {
    console.log('[PassagersService] Loading passagers from:', `${environment.apiUrl}/passagers`);
    this.http.get<Passager[]>(`${environment.apiUrl}/passagers`)
      .subscribe({
        next: (passagers) => {
          console.log('[PassagersService] Received data:', passagers);
          console.log('[PassagersService] Setting', (passagers || []).length, 'passagers');
          this._passagers.set(passagers || []);
        },
        error: (error) => {
          console.error('[PassagersService] ERROR loading passagers:', error);
          console.error('[PassagersService] Error status:', error.status);
          this._passagers.set([]);
        }
      });
  }

  // CRUD Methods
  getAll(): Passager[] {
    return this._passagers();
  }

  getById(id: number): Passager | undefined {
    return this._passagers().find(p => p.id === id);
  }

  create(passager: Omit<Passager, 'id'>): Passager {
    const id = this.generateId();
    const newPassager: Passager = { id, ...passager };
    this._passagers.update(passagers => [...passagers, newPassager]);
    return newPassager;
  }

  update(id: number, updates: Partial<Omit<Passager, 'id'>>): boolean {
    const index = this._passagers().findIndex(p => p.id === id);
    if (index === -1) return false;

    this._passagers.update(passagers => {
      const updated = [...passagers];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    return true;
  }

  delete(id: number): boolean {
    const initialLength = this._passagers().length;
    this._passagers.update(passagers => passagers.filter(p => p.id !== id));
    return this._passagers().length < initialLength;
  }

  private generateId(): number {
    const ids = this._passagers().map(p => p.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }
}
