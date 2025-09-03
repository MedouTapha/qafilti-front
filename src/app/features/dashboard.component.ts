import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import {CurrencyPipe} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CardModule, ButtonModule, RouterModule, CurrencyPipe],
  template: `
    <div class="grid" style="row-gap:1rem">
      <div class="col-12 md:col-4">
        <p-card header="Réservations du jour">
          <div class="text-2xl font-bold">{{ kpis.resaToday }}</div>
          <button pButton label="Voir" routerLink="/reservations"></button>
        </p-card>
      </div>
      <div class="col-12 md:col-4">
        <p-card header="Colis en transit">
          <div class="text-2xl font-bold">{{ kpis.parcelsTransit }}</div>
          <button pButton label="Voir" routerLink="/colis"></button>
        </p-card>
      </div>
      <div class="col-12 md:col-4">
        <p-card header="Revenus (mois)">
          <div class="text-2xl font-bold">{{ kpis.revenueMonth | currency:'EUR' }}</div>
          <button pButton label="Rapports" routerLink="/rapports"></button>
        </p-card>
      </div>
    </div>
  `
})
export class DashboardComponent {
  kpis = {
    resaToday: 12,
    parcelsTransit: 27,
    revenueMonth: 15840
  };
}
