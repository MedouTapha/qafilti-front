import { Component, inject, computed } from '@angular/core';
import { DatePipe, DecimalPipe, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { ReservationsService, Reservation } from '../../core/services/reservations.service';
import { TripsService } from '../../core/services/trips.service';
import { PassagersService } from '../../core/services/passagers.service';
import { TicketPrintComponent } from './ticket-print.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-reservations',
  imports: [TableModule, DialogModule, InputTextModule, Select, DatePicker, ButtonModule, TagModule, FormsModule, InputNumberModule, TooltipModule, DatePipe, DecimalPipe, CommonModule, TicketPrintComponent],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent {
  private readonly reservationsService = inject(ReservationsService);
  private readonly tripsService = inject(TripsService);
  private readonly passagersService = inject(PassagersService);
  private readonly authService = inject(AuthService);

  // Use service signals directly
  readonly reservations = this.reservationsService.reservations;
  readonly userRole = this.authService.userRole;

  statuts = [{ label:'En attente', value:'En attente' },{ label:'Validée', value:'Validée' }];

  // Permissions pour les actions sensibles
  readonly canValidate = computed(() => {
    const role = this.userRole();
    return role === 'caissier' || role === 'admin';
  });

  readonly canPrint = computed(() => {
    const role = this.userRole();
    return role === 'caissier' || role === 'admin';
  });

  // Vérifier si l'utilisateur peut supprimer une réservation
  canDelete(reservation: Reservation): boolean {
    const role = this.userRole();
    // Admin et caissier peuvent supprimer n'importe quelle réservation
    if (role === 'admin' || role === 'caissier') return true;
    // Comptoir peut uniquement supprimer les réservations "En attente"
    if (role === 'comptoir') return reservation.statut === 'En attente';
    return false;
  }

  // Dropdown options for trips and passengers
  readonly tripOptions = computed(() =>
    this.tripsService.trips().map(trip => ({
      label: `${trip.departureCityName || trip.departureCityId} → ${trip.arrivalCityName || trip.arrivalCityId} (${trip.date})`,
      value: trip.tripId
    }))
  );

  readonly passagerOptions = computed(() =>
    this.passagersService.passagers().map(p => ({
      label: p.nom,
      value: p.id?.toString()
    }))
  );

  dialog = false;
  currentId: number | string | null | undefined = null;
  form: Partial<Reservation> = {};
  globalFilter = '';
  ticketToPrint?: Reservation;

  openNew() {
    this.currentId = null;
    this.form = {
      dateReservation: new Date(),
      dateDepart: new Date(),
      date: new Date(), // Legacy
      statut: 'En attente',
      prix: 0,
      passager: '',
      trajet: ''
    };
    this.dialog = true;
  }

  edit(r: Reservation) {
    this.currentId = r.id || r.reservationId;
    this.form = {
      ...r,
      date: r.date ? (typeof r.date === 'string' ? new Date(r.date) : r.date) : undefined,
      dateReservation: r.dateReservation ? (typeof r.dateReservation === 'string' ? new Date(r.dateReservation) : r.dateReservation) : undefined,
      dateDepart: r.dateDepart ? (typeof r.dateDepart === 'string' ? new Date(r.dateDepart) : r.dateDepart) : undefined
    };
    this.dialog = true;
  }

  save() {
    if (this.currentId) {
      // Update existing
      this.reservationsService.update(this.currentId, this.form);
    } else {
      // Create new
      if (this.form.passager && this.form.trajet && this.form.dateDepart && this.form.prix !== undefined && this.form.statut) {
        // Trouver le nom du passager à partir de son ID
        const passagerId = parseInt(this.form.passager);
        const passager = this.passagersService.passagers().find(p => p.id === passagerId);
        const passagerNom = passager?.nom || this.form.passager;

        this.reservationsService.create({
          passager: passagerNom,
          trajet: this.form.trajet,
          date: this.form.dateDepart, // Legacy field
          dateReservation: this.form.dateReservation || new Date(),
          dateDepart: this.form.dateDepart,
          prix: this.form.prix,
          statut: this.form.statut,
          telephone1: this.form.telephone1,
          telephone2: this.form.telephone2
        });
      }
    }
    this.dialog = false;
  }

  remove(r: Reservation) {
    const id = r.id || r.reservationId;
    if (id !== undefined) {
      this.reservationsService.delete(id);
    }
  }

  confirm(r: Reservation) {
    const id = r.id || r.reservationId;
    if (id !== undefined) {
      this.reservationsService.confirm(id);
    }
  }

  print(r: Reservation) {
    this.ticketToPrint = r;
    setTimeout(() => {
      window.print();
      setTimeout(() => this.ticketToPrint = undefined, 100);
    }, 100);
  }
}
