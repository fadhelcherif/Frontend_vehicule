import { Routes } from '@angular/router';
import { VoituresComponent } from './pages/voiture/voitures/voitures.component';
import { ChauffeursComponent } from './pages/chauffeur/chauffeurs/chauffeurs.component';
import { MissionsComponent } from './pages/mission/missions/missions.component';
import { ConsommationsComponent } from './pages/consommation/consommations/consommations.component';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'chauffeurs',
    component: ChauffeursComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'missions',
    component: MissionsComponent
  },
  {
    path: 'consommations',
    component: ConsommationsComponent
  },
  {
    path: 'voitures',
    component: VoituresComponent
  }
];
