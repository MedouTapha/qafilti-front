import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environements/environment';

export interface Colis {
  id: number;
  code: string;
  expediteur: string;
  destinataire: string;
  telephoneExpediteur?: string;
  telephoneDestinataire?: string;
  poids: number;
  volume?: number; // Volume en m³ ou litres
  villeDepart?: string; // Ville de départ
  villeArrivee?: string; // Ville d'arrivée
  tarif: number;
  statut: 'En transit' | 'Livré';
}

@Injectable({ providedIn: 'root' })
export class ColisService {
  private readonly http = inject(HttpClient);

  // Private state with signals
  private readonly _colis = signal<Colis[]>([]);

  // Public readonly signals
  readonly colis = this._colis.asReadonly();
  readonly colisCount = computed(() => this._colis().length);
  readonly inTransitCount = computed(() => this._colis().filter(c => c.statut === 'En transit').length);
  readonly deliveredCount = computed(() => this._colis().filter(c => c.statut === 'Livré').length);

  constructor() {
    this.loadColis();
  }

  // Load data from API
  loadColis(): void {
    console.log('[ColisService] Loading colis from:', `${environment.apiUrl}/colis`);
    this.http.get<Colis[]>(`${environment.apiUrl}/colis`)
      .subscribe({
        next: (colis) => {
          console.log('[ColisService] Received data:', colis);
          console.log('[ColisService] Setting', (colis || []).length, 'colis');
          this._colis.set(colis || []);
        },
        error: (error) => {
          console.error('[ColisService] ERROR loading colis:', error);
          console.error('[ColisService] Error status:', error.status);
          this._colis.set([]);
        }
      });
  }

  // CRUD Methods
  getAll(): Colis[] {
    return this._colis();
  }

  getById(id: number): Colis | undefined {
    return this._colis().find(c => c.id === id);
  }

  getInTransit(): Colis[] {
    return this._colis().filter(c => c.statut === 'En transit');
  }

  create(colis: Omit<Colis, 'id' | 'code'>): Colis {
    const id = this.generateId();
    const code = this.generateCode(id, colis.villeDepart, colis.villeArrivee);
    const newColis: Colis = { id, code, ...colis };
    this._colis.update(colis => [newColis, ...colis]);
    return newColis;
  }

  update(id: number, updates: Partial<Omit<Colis, 'id' | 'code'>>): boolean {
    const index = this._colis().findIndex(c => c.id === id);
    if (index === -1) return false;

    this._colis.update(colis => {
      const updated = [...colis];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    return true;
  }

  delete(id: number): boolean {
    const initialLength = this._colis().length;
    this._colis.update(colis => colis.filter(c => c.id !== id));
    return this._colis().length < initialLength;
  }

  // Business logic methods
  markAsDelivered(id: number): boolean {
    return this.update(id, { statut: 'Livré' });
  }

  private generateId(): number {
    const ids = this._colis().map(c => c.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  private generateCode(id: number, villeDepart?: string, villeArrivee?: string): string {
    // Format: CLS-[DEPART]-[ARRIVEE]-[ID]
    // Example: CLS-NDB-NKT-0001 (Nouadhibou -> Nouakchott)
    const departCode = villeDepart ? this.getCityCode(villeDepart) : 'XXX';
    const arriveeCode = villeArrivee ? this.getCityCode(villeArrivee) : 'XXX';
    return `CLS-${departCode}-${arriveeCode}-${id.toString().padStart(4, '0')}`;
  }

  // Extract 3-letter city code from city name
  private getCityCode(cityName: string): string {
    const normalized = cityName.trim().toUpperCase();
    // Extract first 3 letters or use abbreviation
    if (normalized.length >= 3) {
      return normalized.substring(0, 3);
    }
    return normalized.padEnd(3, 'X');
  }
}
