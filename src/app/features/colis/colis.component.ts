import { Component, inject, computed } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ColisService, Colis } from '../../core/services/colis.service';
import { CitiesService } from '../../core/services/cities.service';

@Component({
  standalone: true,
  selector: 'app-colis',
  imports: [CommonModule, TableModule, DialogModule, InputTextModule, InputNumberModule, Select, ButtonModule, TagModule, FormsModule],
  templateUrl: './colis.component.html',
  styleUrls: ['./colis.component.css']
})
export class ColisComponent {
  private readonly colisService = inject(ColisService);
  private readonly citiesService = inject(CitiesService);

  // Use service signals directly
  readonly colis = this.colisService.colis;

  // City options for dropdowns
  readonly cityOptions = computed(() =>
    this.citiesService.cities().map(c => ({ label: c.nameFr || c.nameAr || c.id, value: c.nameFr || c.nameAr || c.id }))
  );

  dialog = false;
  currentId: number | null = null;
  form: Partial<Colis> = {};
  statuts = [{ label: 'En transit', value: 'En transit' }, { label: 'Livré', value: 'Livré' }];

  openNew() {
    this.currentId = null;
    this.form = {
      statut: 'En transit',
      poids: 0,
      volume: 0,
      tarif: 0,
      expediteur: '',
      destinataire: '',
      telephoneExpediteur: '',
      telephoneDestinataire: '',
      villeDepart: '',
      villeArrivee: ''
    };
    this.dialog = true;
  }

  edit(c: Colis) {
    this.currentId = c.id;
    this.form = { ...c };
    this.dialog = true;
  }

  save() {
    if (this.currentId) {
      // Update existing
      this.colisService.update(this.currentId, this.form);
    } else {
      // Create new
      if (this.form.expediteur && this.form.destinataire && this.form.poids !== undefined && this.form.tarif !== undefined && this.form.statut) {
        this.colisService.create({
          expediteur: this.form.expediteur,
          destinataire: this.form.destinataire,
          telephoneExpediteur: this.form.telephoneExpediteur,
          telephoneDestinataire: this.form.telephoneDestinataire,
          poids: this.form.poids,
          volume: this.form.volume,
          villeDepart: this.form.villeDepart,
          villeArrivee: this.form.villeArrivee,
          tarif: this.form.tarif,
          statut: this.form.statut
        });
      }
    }
    this.dialog = false;
  }

  remove(c: Colis) {
    this.colisService.delete(c.id);
  }

  markDelivered(c: Colis) {
    this.colisService.markAsDelivered(c.id);
  }
}
