import { Component } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
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

export interface Reservation {
  id: number;
  code: string;
  passager: string;
  trajet: string;
  date: Date;
  prix: number;
  statut: 'Brouillon' | 'Confirmée';
}

@Component({
  standalone: true,
  selector: 'app-reservations',
  imports: [TableModule, DialogModule, InputTextModule, Select, DatePicker, ButtonModule, TagModule, FormsModule, InputNumberModule, TooltipModule, DatePipe, CurrencyPipe],
  template: `
    <div class="flex justify-content-between align-items-center mb-3">
      <h2 class="m-0">Réservations</h2>
      <div class="flex gap-2">
        <input pInputText [(ngModel)]="globalFilter" placeholder="Rechercher..." />
        <button pButton label="Nouvelle" (click)="openNew()"></button>
      </div>
    </div>

    <p-table [value]="reservations" [paginator]="true" [rows]="10" [globalFilterFields]="['code','passager','trajet','statut']" [filters]="{ 'global': { value: globalFilter, matchMode: 'contains' } }">
      <ng-template pTemplate="header">
        <tr>
          <th>Code</th><th>Passager</th><th>Trajet</th><th>Date</th><th>Prix</th><th>Statut</th><th>Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-r>
        <tr>
          <td>{{ r.code }}</td>
          <td>{{ r.passager }}</td>
          <td>{{ r.trajet }}</td>
          <td>{{ r.date | date:'shortDate' }}</td>
          <td>{{ r.prix | currency:'EUR' }}</td>
          <td><p-tag [value]="r.statut" [severity]="r.statut==='Confirmée' ? 'success' : 'warning'"/></td>
          <td class="flex gap-2">
            <button pButton icon="pi pi-pencil" (click)="edit(r)"></button>
            <button pButton *ngIf="r.statut==='Brouillon'" icon="pi pi-check" severity="success" (click)="confirm(r)" tooltip="Confirmer"></button>
            <button pButton icon="pi pi-print" (click)="print(r)" tooltip="Imprimer"></button>
            <button pButton icon="pi pi-times" (click)="remove(r)" severity="danger"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog [(visible)]="dialog" [modal]="true" [style]="{width:'450px'}" [header]="current?.id ? 'Modifier' : 'Nouvelle réservation'">
      <div class="flex flex-column gap-3">
        <div>
          <label>Passager</label>
          <input pInputText [(ngModel)]="form.passager" />
        </div>
        <div>
          <label>Trajet</label>
          <input pInputText [(ngModel)]="form.trajet" placeholder="Casa → Rabat" />
        </div>
        <div class="grid">
          <div class="col-6">
            <label>Date</label>
            <p-datepicker [(ngModel)]="form.date" dateFormat="dd/mm/yy"></p-datepicker>
          </div>
          <div class="col-6">
            <label>Prix</label>
            <p-inputNumber [(ngModel)]="form.prix" mode="currency" currency="EUR"></p-inputNumber>
          </div>
        </div>
        <div>
          <label>Statut</label>
          <p-select [options]="statuts" optionLabel="label" optionValue="value" [(ngModel)]="form.statut"></p-select>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <button pButton label="Annuler" (click)="dialog=false" text></button>
        <button pButton label="Enregistrer" (click)="save()"></button>
      </ng-template>
    </p-dialog>
  `
})
export class ReservationsComponent {
  reservations: Reservation[] = [
    { id:1, code:'RSV-0001', passager:'Amina L.', trajet:'Casa → Rabat', date:new Date(), prix:12, statut:'Confirmée' },
    { id:2, code:'RSV-0002', passager:'Youssef M.', trajet:'Rabat → Fès', date:new Date(), prix:18, statut:'Brouillon' },
  ];

  statuts = [{ label:'Brouillon', value:'Brouillon' },{ label:'Confirmée', value:'Confirmée' }];

  dialog = false;
  current: Reservation | null = null;
  form: any = {};
  globalFilter = '';

  openNew(){ this.current = null; this.form = { date:new Date(), statut:'Brouillon', prix:0 }; this.dialog = true; }
  edit(r: Reservation){ this.current = r; this.form = { ...r }; this.dialog = true; }

  save(){
    if(this.current){
      Object.assign(this.current, this.form);
    } else {
      const id = Math.max(0, ...this.reservations.map(x=>x.id)) + 1;
      const code = `RSV-${id.toString().padStart(4,'0')}`;
      this.reservations.unshift({ id, code, ...this.form });
    }
    this.dialog = false;
  }

  remove(r: Reservation){ this.reservations = this.reservations.filter(x=>x.id!==r.id); }
  confirm(r: Reservation){
    if(r.statut !== 'Confirmée'){
      // ensure code exists
      if(!r.code){
        const id = Math.max(0, ...this.reservations.map(x=>x.id)) + 1;
        r.code = `RSV-${id.toString().padStart(4,'0')}`;
        r.id = id;
      }
      r.statut = 'Confirmée';
    }
  }
  print(r: Reservation){ window.print(); }
}
