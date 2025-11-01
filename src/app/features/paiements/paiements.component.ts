import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { PaiementsService } from '../../core/services/paiements.service';

@Component({
  standalone: true,
  selector: 'app-paiements',
  imports: [TableModule, DialogModule, InputTextModule, InputNumberModule, ButtonModule, FormsModule, DecimalPipe],
  templateUrl: './paiements.component.html',
  styleUrls: ['./paiements.component.css']
})
export class PaiementsComponent {
  private readonly paiementsService = inject(PaiementsService);

  // Use service signals directly
  readonly paiements = this.paiementsService.paiements;

  test() {
    console.log('test');
  }
}
