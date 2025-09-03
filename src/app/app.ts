import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MenubarModule, ButtonModule],
  template: `
    <p-menubar [model]="items" class="mb-3">
      <ng-template pTemplate="start">
        <span class="font-semibold">Qafilti</span>
      </ng-template>
    </p-menubar>
    <div class="p-3">
      <router-outlet></router-outlet>
    </div>
  `
})
export class App {
  items = [
    { label: 'Tableau de bord', icon: 'pi pi-home', routerLink: [''] },
    { label: 'Opérations', icon: 'pi pi-briefcase', items: [
        { label: 'Réservations', icon: 'pi pi-ticket', routerLink: ['reservations'] },
        { label: 'Passagers', icon: 'pi pi-users', routerLink: ['passagers'] },
        { label: 'Colis', icon: 'pi pi-inbox', routerLink: ['colis'] },
        { label: 'Paiements', icon: 'pi pi-wallet', routerLink: ['paiements'] },
      ]
    },
    { label: 'Rapports', icon: 'pi pi-chart-line', routerLink: ['rapports'] },
    { label: 'Administration', icon: 'pi pi-cog', routerLink: ['admin'] },
  ];
}
