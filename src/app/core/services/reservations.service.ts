import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environements/environment';

export interface Reservation {
  reservationId?: string;
  id?: number;
  code?: string;
  tripId?: string;
  passager?: string;
  passengerName?: string;
  passengerPhone?: string;
  telephone1?: string;
  telephone2?: string;
  trajet?: string;
  dateReservation?: Date | string; // Date de réservation
  dateDepart?: Date | string; // Date de départ
  date?: Date | string; // Legacy field for compatibility
  prix?: number;
  netAmount?: number;
  seatNumber?: string;
  statut?: 'En attente' | 'Validée' | 'CONFIRMED' | 'PENDING' | 'CREATED';
  status?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly http = inject(HttpClient);

  // Private state with signals
  private readonly _reservations = signal<Reservation[]>([]);

  // Public readonly signals
  readonly reservations = this._reservations.asReadonly();
  readonly reservationsCount = computed(() => this._reservations().length);
  readonly confirmedCount = computed(() => {
    return this._reservations().filter(r =>
      r.statut === 'Validée' || r.status === 'CONFIRMED'
    ).length;
  });
  readonly todayCount = computed(() => {
    const today = new Date().toDateString();
    return this._reservations().filter(r => {
      const reservDate = r.date ? new Date(r.date) : null;
      return reservDate && reservDate.toDateString() === today;
    }).length;
  });

  constructor() {
    this.loadReservations();
  }

  // Load data from API
  loadReservations(): void {
    console.log('[ReservationsService] Loading reservations from:', `${environment.apiUrl}/reservation`);
    this.http.get<Reservation[]>(`${environment.apiUrl}/reservation`)
      .subscribe({
        next: (reservations) => {
          console.log('[ReservationsService] Received data:', reservations);
          console.log('[ReservationsService] Data type:', typeof reservations, 'Is array:', Array.isArray(reservations));
          // Map Mockoon data to application format
          const mappedReservations = (reservations || []).map(r => ({
            ...r,
            // Map Mockoon fields to app fields
            code: r.code || r.reservationId || '',
            passager: r.passager || r.passengerName || '',
            trajet: r.trajet || r.tripId || 'Trajet à définir',
            date: r.date || r.createdAt || new Date().toISOString(),
            dateReservation: r.dateReservation || r.createdAt || new Date().toISOString(),
            dateDepart: r.dateDepart || r.date || new Date().toISOString(),
            prix: r.prix ?? r.netAmount ?? 0,
            statut: this.mapStatus(r.status || r.statut),
            // Keep original fields for compatibility
            reservationId: r.reservationId,
            passengerName: r.passengerName,
            netAmount: r.netAmount,
            createdAt: r.createdAt
          }));
          console.log('[ReservationsService] Mapped reservations:', mappedReservations);
          console.log('[ReservationsService] Setting', mappedReservations.length, 'reservations');
          this._reservations.set(mappedReservations);
        },
        error: (error) => {
          console.error('[ReservationsService] ERROR loading reservations:', error);
          console.error('[ReservationsService] Error status:', error.status);
          console.error('[ReservationsService] Error message:', error.message);
          // Fallback to empty array on error
          this._reservations.set([]);
        }
      });
  }

  // Map English status to French
  private mapStatus(status?: string): 'En attente' | 'Validée' {
    if (!status) return 'En attente';
    const statusMap: Record<string, 'En attente' | 'Validée'> = {
      'CONFIRMED': 'Validée',
      'PENDING': 'En attente',
      'CREATED': 'En attente',
      'Validée': 'Validée',
      'En attente': 'En attente',
      // Legacy support
      'Confirmée': 'Validée',
      'Brouillon': 'En attente'
    };
    return statusMap[status] || 'En attente';
  }

  // CRUD Methods
  getAll(): Reservation[] {
    return this._reservations();
  }

  getById(id: number | string): Reservation | undefined {
    return this._reservations().find(r =>
      r.id === id || r.reservationId === id
    );
  }

  create(reservation: Partial<Reservation>): Reservation {
    const newReservation: Reservation = {
      id: this.generateId(),
      code: this.generateCode(this.generateId()),
      ...reservation
    };
    this._reservations.update(reservations => [newReservation, ...reservations]);
    return newReservation;
  }

  update(id: number | string, updates: Partial<Reservation>): boolean {
    const index = this._reservations().findIndex(r =>
      r.id === id || r.reservationId === id
    );
    if (index === -1) return false;

    this._reservations.update(reservations => {
      const updated = [...reservations];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
    return true;
  }

  delete(id: number | string): boolean {
    const initialLength = this._reservations().length;
    this._reservations.update(reservations =>
      reservations.filter(r => r.id !== id && r.reservationId !== id)
    );
    return this._reservations().length < initialLength;
  }

  // Business logic methods - Valider une réservation (seul le caissier peut le faire)
  validate(id: number | string): boolean {
    const reservation = this.getById(id);
    if (!reservation) return false;
    if (reservation.statut === 'Validée' || reservation.status === 'CONFIRMED') {
      return false;
    }

    return this.update(id, { statut: 'Validée', status: 'CONFIRMED' });
  }

  // Legacy method for compatibility
  confirm(id: number | string): boolean {
    return this.validate(id);
  }

  private generateId(): number {
    const ids = this._reservations().map(r => r.id || 0).filter(id => id > 0);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  private generateCode(id: number): string {
    return `RSV-${id.toString().padStart(4, '0')}`;
  }
}
