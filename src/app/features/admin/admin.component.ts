import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tabs, Tab, TabPanels, TabPanel, TabList } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { TrajetsService, Trajet } from '../../core/services/trajets.service';
import { TarifsService, Tarif } from '../../core/services/tarifs.service';
import { BusService, Bus } from '../../core/services/bus.service';
import { CitiesService, City } from '../../core/services/cities.service';
import { TripsService, Trip } from '../../core/services/trips.service';
import { ReservationsService, Reservation } from '../../core/services/reservations.service';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [Tabs, Tab, TabPanels, TabPanel, TabList, TableModule, DialogModule, InputTextModule, InputNumberModule, FormsModule, ButtonModule, Select],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly trajetsService = inject(TrajetsService);
  private readonly tarifsService = inject(TarifsService);
  private readonly busService = inject(BusService);
  private readonly citiesService = inject(CitiesService);
  private readonly tripsService = inject(TripsService);
  private readonly reservationsService = inject(ReservationsService);
  private readonly settingsService = inject(SettingsService);

  // Active tab management
  readonly activeTab = signal<number>(0);

  ngOnInit() {
    // Subscribe to query params to update active tab
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      const tabIndex = this.getTabIndex(tab);
      this.activeTab.set(tabIndex);
    });
  }

  private getTabIndex(tabName: string | undefined): number {
    const tabMap: { [key: string]: number } = {
      'bus': 0,
      'villes': 1,
      'trips': 2,
      'trajets': 3,
      'tarifs': 4,
      'parametres': 5
    };
    return tabName ? (tabMap[tabName] ?? 0) : 0;
  }

  // Use service signals directly
  readonly trajets = this.trajetsService.trajets;
  readonly tarifs = this.tarifsService.tarifs;
  readonly buses = this.busService.buses;
  readonly cities = this.citiesService.cities;
  readonly trips = this.tripsService.trips;
  readonly reservations = this.reservationsService.reservations;

  // Map of confirmed reservations by tripId
  readonly confirmedByTrip = computed(() => {
    const map = new Map<string, number>();
    const list = this.reservations();
    for (const r of list) {
      const isConfirmed = r.statut === 'Validée' || r.status === 'CONFIRMED';
      const tId = r.tripId;
      if (isConfirmed && tId) {
        map.set(tId, (map.get(tId) || 0) + 1);
      }
    }
    return map;
  });

  // Remaining capacity = bus capacity - confirmed reservations
  remainingCapacity(t: Trip): number {
    const busId = t.vehicleId;
    const tripId = t.tripId;
    if (!busId || !tripId) return 0;
    const bus = this.buses().find(b => b.id === busId);
    const capacity = bus?.capacity ?? 0;
    const confirmed = this.confirmedByTrip().get(tripId) ?? 0;
    const remaining = capacity - confirmed;
    return remaining > 0 ? remaining : 0;
  }

  // Dropdown options for forms
  readonly cityOptions = computed(() =>
    this.cities().map(c => ({ label: c.nameFr || c.nameAr || c.id, value: c.id }))
  );

  readonly busOptions = computed(() =>
    this.buses().map(b => ({ label: `${b.id} - ${b.license_plate}`, value: b.id }))
  );

  readonly trajetOptions = computed(() =>
    this.trajets().map(t => ({ label: `${t.code} - ${t.origine} → ${t.destination}`, value: t.code }))
  );

  // Settings
  readonly passengerIdentifierLabel = this.settingsService.passengerIdentifierLabel;
  selectedIdentifierType = this.settingsService.passengerIdentifierType();
  identifierTypeOptions = [
    { label: 'NNI uniquement', value: 'NNI' },
    { label: 'Passport uniquement', value: 'Passport' },
    { label: 'NNI ou Passport (les deux)', value: 'Both' }
  ];

  onIdentifierTypeChange(): void {
    this.settingsService.setPassengerIdentifierType(this.selectedIdentifierType as 'NNI' | 'Passport' | 'Both');
  }

  // Trajets
  trajetDialog = false;
  currentTrajetId: number | null | undefined = null;
  trajetForm: Partial<Trajet> = {};

  openTrajet() {
    this.currentTrajetId = null;
    this.trajetForm = {};
    this.trajetDialog = true;
  }

  editTrajet(t: Trajet) {
    this.currentTrajetId = t.id;
    this.trajetForm = { ...t };
    this.trajetDialog = true;
  }

  saveTrajet() {
    if (this.currentTrajetId) {
      this.trajetsService.update(this.currentTrajetId, this.trajetForm);
    } else {
      if (this.trajetForm.code && this.trajetForm.origine && this.trajetForm.destination) {
        this.trajetsService.create({
          code: this.trajetForm.code,
          origine: this.trajetForm.origine,
          destination: this.trajetForm.destination
        });
      }
    }
    this.trajetDialog = false;
  }

  removeTrajet(t: Trajet) {
    if (t.id !== undefined) {
      this.trajetsService.delete(t.id);
    }
  }

  // Tarifs
  tarifDialog = false;
  currentTarifId: number | null = null;
  tarifForm: Partial<Tarif> = {};

  openTarif() {
    this.currentTarifId = null;
    this.tarifForm = {};
    this.tarifDialog = true;
  }

  editTarif(f: Tarif) {
    this.currentTarifId = f.id;
    this.tarifForm = { ...f };
    this.tarifDialog = true;
  }

  saveTarif() {
    if (this.currentTarifId) {
      this.tarifsService.update(this.currentTarifId, this.tarifForm);
    } else {
      if (this.tarifForm.trajet && this.tarifForm.prix !== undefined) {
        this.tarifsService.create({
          trajet: this.tarifForm.trajet,
          prix: this.tarifForm.prix
        });
      }
    }
    this.tarifDialog = false;
  }

  removeTarif(f: Tarif) {
    this.tarifsService.delete(f.id);
  }

  // Bus
  busDialog = false;
  currentBusId: string | null = null;
  busForm: Partial<Bus> = {};
  busStatusOptions = [
    { label: 'Actif', value: 'active' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Inactif', value: 'inactive' }
  ];

  openBus() {
    this.currentBusId = null;
    this.busForm = { status: 'active' };
    this.busDialog = true;
  }

  editBus(b: Bus) {
    this.currentBusId = b.id || null;
    this.busForm = { ...b };
    this.busDialog = true;
  }

  saveBus() {
    if (this.currentBusId) {
      this.busService.update(this.currentBusId, this.busForm);
    } else {
      if (this.busForm.license_plate && this.busForm.capacity !== undefined) {
        this.busService.create({
          license_plate: this.busForm.license_plate,
          status: this.busForm.status || 'active',
          capacity: this.busForm.capacity
        });
      }
    }
    this.busDialog = false;
  }

  removeBus(b: Bus) {
    if (b.id) {
      this.busService.delete(b.id);
    }
  }

  // Cities
  cityDialog = false;
  currentCityId: string | null = null;
  cityForm: Partial<City> = {};

  openCity() {
    this.currentCityId = null;
    this.cityForm = {};
    this.cityDialog = true;
  }

  editCity(c: City) {
    this.currentCityId = c.id || null;
    this.cityForm = { ...c };
    this.cityDialog = true;
  }

  saveCity() {
    if (this.currentCityId) {
      this.citiesService.update(this.currentCityId, this.cityForm);
    } else {
      if (this.cityForm.nameFr && this.cityForm.nameAr) {
        this.citiesService.create({
          nameFr: this.cityForm.nameFr,
          nameAr: this.cityForm.nameAr
        });
      }
    }
    this.cityDialog = false;
  }

  removeCity(c: City) {
    if (c.id) {
      this.citiesService.delete(c.id);
    }
  }

  // Trips
  tripDialog = false;
  currentTripId: string | null = null;
  tripForm: Partial<Trip> = {};

  openTrip() {
    this.currentTripId = null;
    this.tripForm = { date: new Date().toISOString().split('T')[0] };
    this.tripDialog = true;
  }

  editTrip(t: Trip) {
    this.currentTripId = t.tripId || null;
    this.tripForm = { ...t };
    this.tripDialog = true;
  }

  saveTrip() {
    // Enrich trip form with city names from selected city IDs
    if (this.tripForm.departureCityId) {
      const departureCity = this.cities().find(c => c.id === this.tripForm.departureCityId);
      if (departureCity) {
        this.tripForm.departureCityName = departureCity.nameFr;
        this.tripForm.departureCityNameAr = departureCity.nameAr;
      }
    }
    if (this.tripForm.arrivalCityId) {
      const arrivalCity = this.cities().find(c => c.id === this.tripForm.arrivalCityId);
      if (arrivalCity) {
        this.tripForm.arrivalCityName = arrivalCity.nameFr;
        this.tripForm.arrivalCityNameAr = arrivalCity.nameAr;
      }
    }

    if (this.currentTripId) {
      this.tripsService.update(this.currentTripId, this.tripForm);
    } else {
      if (this.tripForm.date && this.tripForm.departureCityId && this.tripForm.arrivalCityId && this.tripForm.vehicleId) {
        this.tripsService.create(this.tripForm as Trip);
      }
    }
    this.tripDialog = false;
  }

  removeTrip(t: Trip) {
    if (t.tripId) {
      this.tripsService.delete(t.tripId);
    }
  }
}
