import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-passagers',
  imports: [TableModule, DialogModule, InputTextModule, ButtonModule, FormsModule],
  template: `
    <div class="flex justify-content-between align-items-center mb-3">
      <h2 class="m-0">Passagers</h2>
      <div class="flex gap-2">
        <input pInputText [(ngModel)]="filter" placeholder="Rechercher..." />
        <button pButton label="Ajouter" (click)="open()"></button>
      </div>
    </div>

    <p-table [value]="rows" [paginator]="true" [rows]="10" [filters]="{ 'global': { value: filter, matchMode: 'contains' } }" [globalFilterFields]="['nom','telephone','document']">
      <ng-template pTemplate="header">
        <tr><th>Nom</th><th>Téléphone</th><th>Document</th><th>Actions</th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-p>
        <tr>
          <td>{{ p.nom }}</td>
          <td>{{ p.telephone }}</td>
          <td>{{ p.document }}</td>
          <td class="flex gap-2">
            <button pButton icon="pi pi-pencil" (click)="open()"></button>
            <button pButton icon="pi pi-times" severity="danger" (click)="open()"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog [(visible)]="dialog" [modal]="true" header="Passager" [style]="{width:'420px'}">
      <div class="flex flex-column gap-3">
        <input pInputText placeholder="Nom complet" [(ngModel)]="form.nom" />
        <input pInputText placeholder="Téléphone" [(ngModel)]="form.telephone" />
        <input pInputText placeholder="Document (CIN/Passport)" [(ngModel)]="form" />
      </div>
      <ng-template pTemplate="footer">
        <button pButton label="Annuler" (click)="dialog=false" text></button>
        <button pButton label="Enregistrer" (click)="save()"></button>
      </ng-template>
    </p-dialog>
  `
})
export class PassagersComponent {
  form: any = {};

  rows = [
    { id: 1, nom: 'Jean Dupont', telephone: '0601020304', document: 'CIN123456' },
    { id: 2, nom: 'Marie Curie', telephone: '0605060708', document: 'CIN654321' },
    { id: 3, nom: 'Ali Ben Ali', telephone: '0611121314', document: 'CIN112233' }
  ];
  filter = '';
  dialog = false;
   open() {
    this.form = {};
    this.dialog = true;
  }

  save() {
    if (this.form.id) {
      const index = this.rows.findIndex((r: any) => r.id === this.form.id);
      this.rows[index] = this.form;
    } else {
      this.form.id = this.rows.length ? Math.max(...this.rows.map((r: any) => r.id)) + 1 : 1;
      this.rows.push(this.form);
    }
    this.dialog = false;
    this.form = {};
  }
   }
