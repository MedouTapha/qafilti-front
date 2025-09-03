import { Component } from '@angular/core';
import { TabPanel, TabList } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [TabPanel, TabList, TableModule, DialogModule, InputTextModule, FormsModule, ButtonModule],
  template: `
    <p-tablist>
      <p-tabpanel header="Trajets">
        <div class="flex justify-content-between align-items-center mb-2">
          <h3 class="m-0">Trajets</h3>
          <button pButton label="Ajouter" (click)="openTrajet()"></button>
        </div>
        <p-table [value]="trajets">
          <ng-template pTemplate="header">
            <tr><th>Code</th><th>Origine</th><th>Destination</th><th>Actions</th></tr>
          </ng-template>
          <ng-template pTemplate="body" let-t>
            <tr>
              <td>{{ t.code }}</td>
              <td>{{ t.origine }}</td>
              <td>{{ t.destination }}</td>
              <td>
                <button pButton icon="pi pi-pencil" (click)="editTrajet(t)"></button>
                <button pButton icon="pi pi-times" severity="danger" (click)="removeTrajet(t)"></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-tabpanel>
      <p-tabpanel header="Véhicules">
        <div class="flex justify-content-between align-items-center mb-2">
          <h3 class="m-0">Véhicules</h3>
          <button pButton label="Ajouter" (click)="openVehicule()"></button>
        </div>
        <p-table [value]="vehicules">
          <ng-template pTemplate="header">
            <tr><th>Matricule</th><th>Modèle</th><th>Capacité</th><th>Actions</th></tr>
          </ng-template>
          <ng-template pTemplate="body" let-v>
            <tr>
              <td>{{ v.matricule }}</td>
              <td>{{ v.modele }}</td>
              <td>{{ v.capacite }}</td>
              <td>
                <button pButton icon="pi pi-pencil" (click)="editVehicule(v)"></button>
                <button pButton icon="pi pi-times" severity="danger" (click)="removeVehicule(v)"></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-tabpanel>
      <p-tabpanel header="Tarifs">
        <div class="flex justify-content-between align-items-center mb-2">
          <h3 class="m-0">Tarifs</h3>
          <button pButton label="Ajouter" (click)="openTarif()"></button>
        </div>
        <p-table [value]="tarifs">
          <ng-template pTemplate="header">
            <tr><th>Trajet</th><th>Prix (€)</th><th>Actions</th></tr>
          </ng-template>
          <ng-template pTemplate="body" let-f>
            <tr>
              <td>{{ f.trajet }}</td>
              <td>{{ f.prix }}</td>
              <td>
                <button pButton icon="pi pi-pencil" (click)="editTarif(f)"></button>
                <button pButton icon="pi pi-times" severity="danger" (click)="removeTarif(f)"></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-tabpanel>
    </p-tablist>

    <!-- Dialogs -->
    <p-dialog [(visible)]="trajetDialog" header="Trajet" [modal]="true" [style]="{width:'420px'}">
      <div class="flex flex-column gap-2">
        <input pInputText placeholder="Code" [(ngModel)]="trajetForm.code" />
        <input pInputText placeholder="Origine" [(ngModel)]="trajetForm.origine" />
        <input pInputText placeholder="Destination" [(ngModel)]="trajetForm.destination" />
      </div>
      <ng-template pTemplate="footer">
        <button pButton label="Annuler" (click)="trajetDialog=false" text></button>
        <button pButton label="Enregistrer" (click)="saveTrajet()"></button>
      </ng-template>
    </p-dialog>

    <p-dialog [(visible)]="vehiculeDialog" header="Véhicule" [modal]="true" [style]="{width:'420px'}">
      <div class="flex flex-column gap-2">
        <input pInputText placeholder="Matricule" [(ngModel)]="vehiculeForm.matricule" />
        <input pInputText placeholder="Modèle" [(ngModel)]="vehiculeForm.modele" />
        <input pInputText placeholder="Capacité" [(ngModel)]="vehiculeForm.capacite" />
      </div>
      <ng-template pTemplate="footer">
        <button pButton label="Annuler" (click)="vehiculeDialog=false" text></button>
        <button pButton label="Enregistrer" (click)="saveVehicule()"></button>
      </ng-template>
    </p-dialog>

    <p-dialog [(visible)]="tarifDialog" header="Tarif" [modal]="true" [style]="{width:'420px'}">
      <div class="flex flex-column gap-2">
        <input pInputText placeholder="Trajet" [(ngModel)]="tarifForm.trajet" />
        <input pInputText placeholder="Prix (€)" [(ngModel)]="tarifForm.prix" />
      </div>
      <ng-template pTemplate="footer">
        <button pButton label="Annuler" (click)="tarifDialog=false" text></button>
        <button pButton label="Enregistrer" (click)="saveTarif()"></button>
      </ng-template>
    </p-dialog>
  `
})
export class AdminComponent {
  // Trajets
  trajets: { id:number; code:string; origine:string; destination:string }[] = [
    { id:1, code:'TRJ-01', origine:'Casa', destination:'Rabat' },
  ];
  trajetDialog=false; currentTrajet:any=null; trajetForm:any={};
  openTrajet(){ this.currentTrajet=null; this.trajetForm={}; this.trajetDialog=true; }
  editTrajet(t:any){ this.currentTrajet=t; this.trajetForm={...t}; this.trajetDialog=true; }
  saveTrajet(){ if(this.currentTrajet){ Object.assign(this.currentTrajet,this.trajetForm);} else { const id=Math.max(0,...this.trajets.map(x=>x.id))+1; this.trajets.unshift({ id, ...this.trajetForm }); } this.trajetDialog=false; }
  removeTrajet(t:any){ this.trajets=this.trajets.filter(x=>x.id!==t.id); }

  // Véhicules
  vehicules: { id:number; matricule:string; modele:string; capacite:number }[] = [
    { id:1, matricule:'ABC-123', modele:'Mercedes Sprinter', capacite:18 },
  ];
  vehiculeDialog=false; currentVehicule:any=null; vehiculeForm:any={};
  openVehicule(){ this.currentVehicule=null; this.vehiculeForm={}; this.vehiculeDialog=true; }
  editVehicule(v:any){ this.currentVehicule=v; this.vehiculeForm={...v}; this.vehiculeDialog=true; }
  saveVehicule(){ if(this.currentVehicule){ Object.assign(this.currentVehicule,this.vehiculeForm);} else { const id=Math.max(0,...this.vehicules.map(x=>x.id))+1; this.vehicules.unshift({ id, ...this.vehiculeForm }); } this.vehiculeDialog=false; }
  removeVehicule(v:any){ this.vehicules=this.vehicules.filter(x=>x.id!==v.id); }

  // Tarifs
  tarifs: { id:number; trajet:string; prix:number }[] = [
    { id:1, trajet:'Casa → Rabat', prix:12 },
  ];
  tarifDialog=false; currentTarif:any=null; tarifForm:any={};
  openTarif(){ this.currentTarif=null; this.tarifForm={}; this.tarifDialog=true; }
  editTarif(f:any){ this.currentTarif=f; this.tarifForm={...f}; this.tarifDialog=true; }
  saveTarif(){ if(this.currentTarif){ Object.assign(this.currentTarif,this.tarifForm);} else { const id=Math.max(0,...this.tarifs.map(x=>x.id))+1; this.tarifs.unshift({ id, ...this.tarifForm }); } this.tarifDialog=false; }
  removeTarif(f:any){ this.tarifs=this.tarifs.filter(x=>x.id!==f.id); }
}
