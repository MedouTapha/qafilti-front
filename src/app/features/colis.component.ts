import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-colis',
  imports: [TableModule, DialogModule, InputTextModule, InputNumberModule, Select, ButtonModule, TagModule, FormsModule],
  template: `
    <div class="flex justify-content-between align-items-center mb-3">
      <h2 class="m-0">Colis</h2>
      <div class="flex gap-2">
        <input pInputText [(ngModel)]="globalFilter" placeholder="Rechercher..." />
        <button pButton label="Nouveau" (click)="openNew()"></button>
      </div>
    </div>

    <p-table [value]="colis" [paginator]="true" [rows]="10" [globalFilterFields]="['code','expediteur','destinataire','statut']" [filters]="{ 'global': { value: globalFilter, matchMode: 'contains' } }">
      <ng-template pTemplate="header">
        <tr><th>Code</th><th>Expéditeur</th><th>Destinataire</th><th>Poids (kg)</th><th>Tarif</th><th>Statut</th><th>Actions</th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-c>
        <tr>
          <td>{{ c.code }}</td>
          <td>{{ c.expediteur }}</td>
          <td>{{ c.destinataire }}</td>
          <td>{{ c.poids }}</td>
          <td>{{ c.tarif }} €</td>
          <td><p-tag [value]="c.statut" [severity]="c.statut==='Livré' ? 'success' : 'warning'"/></td>
          <td class="flex gap-2">
            <button pButton icon="pi pi-pencil" (click)="edit(c)"></button>
            <button pButton icon="pi pi-check" *ngIf="c.statut!=='Livré'" (click)="markDelivered(c)" severity="success" tooltip="Marquer livré"></button>
            <button pButton icon="pi pi-times" (click)="remove(c)" severity="danger"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog [(visible)]="dialog" header="Colis" [modal]="true" [style]="{width:'420px'}">
      <div class="flex flex-column gap-2">
        <input pInputText placeholder="Expéditeur" [(ngModel)]="form.expediteur" />
        <input pInputText placeholder="Destinataire" [(ngModel)]="form.destinataire" />
        <p-inputNumber placeholder="Poids (kg)" [(ngModel)]="form.poids"></p-inputNumber>
        <p-inputNumber placeholder="Tarif (€)" [(ngModel)]="form.tarif"></p-inputNumber>
        <p-select [options]="statuts" optionLabel="label" optionValue="value" [(ngModel)]="form.statut"></p-select>
      </div>
      <ng-template pTemplate="footer">
        <button pButton label="Annuler" (click)="dialog=false" text></button>
        <button pButton label="Enregistrer" (click)="save()"></button>
      </ng-template>
    </p-dialog>
  `
})
export class ColisComponent {
  colis: { id:number; code:string; expediteur:string; destinataire:string; poids:number; tarif:number; statut:'En transit'|'Livré' }[] = [
    { id:1, code:'CLS-0001', expediteur:'Nadia', destinataire:'Karim', poids:3.2, tarif:8, statut:'En transit' },
  ];
  dialog=false; current:any=null; form:any={}; globalFilter='';
  statuts=[{label:'En transit', value:'En transit'},{label:'Livré', value:'Livré'}];

  openNew(){ this.current=null; this.form={ statut:'En transit', poids:0, tarif:0 }; this.dialog=true; }
  edit(c:any){ this.current=c; this.form={...c}; this.dialog=true; }
  save(){ if(this.current){ Object.assign(this.current,this.form);} else { const id=Math.max(0,...this.colis.map(x=>x.id))+1; const code=`CLS-${id.toString().padStart(4,'0')}`; this.colis.unshift({ id, code, ...this.form }); } this.dialog=false; }
  remove(c:any){ this.colis=this.colis.filter(x=>x.id!==c.id); }
  markDelivered(c:any){ c.statut='Livré'; }
}
