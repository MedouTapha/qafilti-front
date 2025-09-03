import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import {CurrencyPipe} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-paiements',
  imports: [TableModule, DialogModule, InputTextModule, InputNumberModule, ButtonModule, FormsModule, CurrencyPipe],
  template: `
    <div class="flex justify-content-between align-items-center mb-3">
      <h2 class="m-0">Paiements</h2>
      <button pButton label="Enregistrer un paiement" (click)="test()"></button>
    </div>

    <p-table [value]="rows" [paginator]="true" [rows]="10">
      <ng-template pTemplate="header">
        <tr><th>Réf</th><th>Type</th><th>Montant</th><th>Mode</th><th>Note</th><th>Actions</th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-p>
        <tr>
          <td>{{ p.ref }}</td>
          <td>{{ p.type }}</td>
          <td>{{ p.montant | currency:'EUR' }}</td>
          <td>{{ p.mode }}</td>
          <td>{{ p.note }}</td>
          <td>
            <button pButton icon="pi pi-pencil" (click)="test()"></button>
            <button pButton icon="pi pi-times" severity="danger" (click)="test()"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>


  `
})
export class PaiementsComponent {
  rows = [
    { ref: '12345', type: 'Acompte', montant: 500, mode: 'Carte bancaire', note: 'Premier paiement' },
    { ref: '67890', type: 'Solde', montant: 1500, mode: 'Virement', note: 'Paiement final' }
  ];
  test(){
    console.log('test');
  }
  }
