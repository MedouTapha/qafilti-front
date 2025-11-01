import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DecimalPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { RapportsService } from '../../core/services/rapports.service';

@Component({
  standalone: true,
  selector: 'app-rapports',
  imports: [CardModule, TableModule, DecimalPipe, InputTextModule, FormsModule],
  templateUrl: './rapports.component.html',
  styleUrls: ['./rapports.component.css']
})
export class RapportsComponent {
  private readonly rapportsService = inject(RapportsService);

  // Use service signals directly
  readonly kpis = this.rapportsService.kpis;
  readonly revenusTrajets = this.rapportsService.revenueByRoute;

  // Search filter
  rapportFilter = '';
}
