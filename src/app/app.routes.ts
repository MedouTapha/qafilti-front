import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard.component';
import { ReservationsComponent } from './features/reservations.component';
import { PassagersComponent } from './features/passagers.component';
import { ColisComponent } from './features/colis.component';
import { PaiementsComponent } from './features/paiements.component';
import { RapportsComponent } from './features/rapports.component';
import { AdminComponent } from './features/admin.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'passagers', component: PassagersComponent },
  { path: 'colis', component: ColisComponent },
  { path: 'paiements', component: PaiementsComponent },
  { path: 'rapports', component: RapportsComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' },
];
