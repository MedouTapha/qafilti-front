import { Component, computed, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  standalone: true,
  selector: 'app-rapports',
  imports: [CardModule, TableModule, DecimalPipe, CurrencyPipe],
  template: `
    <div class="grid" style="row-gap:1rem">
      <div class="col-12 md:col-4">
        <p-card header="Ventes billets (mois)">
          <div class="text-2xl font-bold">{{ kpis().billets | currency:'EUR' }}</div>
        </p-card>
      </div>
      <div class="col-12 md:col-4">
        <p-card header="Ventes colis (mois)">
          <div class="text-2xl font-bold">{{ kpis().colis | currency:'EUR' }}</div>
        </p-card>
      </div>
      <div class="col-12 md:col-4">
        <p-card header="Taux de remplissage estimé">
          <div class="text-2xl font-bold">{{ kpis().fillRate }}%</div>
        </p-card>
      </div>
      <div class="col-12">
        <p-card header="Revenus par trajet (mock)">
          <p-table [value]="revenusTrajets">
            <ng-template pTemplate="header">
              <tr><th>Trajet</th><th>Réservations</th><th>Revenu (€)</th></tr>
            </ng-template>
            <ng-template pTemplate="body" let-r>
              <tr><td>{{ r.trajet }}</td><td>{{ r.count }}</td><td>{{ r.revenu | number:'1.2-2' }}</td></tr>
            </ng-template>
          </p-table>
        </p-card>
      </div>
    </div>
  `
})
export class RapportsComponent {
  revenusTrajets = [
    { trajet:'Casa → Rabat', count:120, revenu:1440 },
    { trajet:'Rabat → Fès', count:80, revenu:1440 },
    { trajet:'Casa → Marrakech', count:95, revenu:1900 },
  ];
  kpis = signal({ billets: 3200, colis: 860, fillRate: 78 });
}
