import { Routes } from '@angular/router';
import { VoituresComponent } from './pages/voiture/voitures/voitures.component';
import { ChauffeursComponent } from './pages/chauffeur/chauffeurs/chauffeurs.component';
import { MissionsComponent } from './pages/mission/missions/missions.component';

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
    path: 'missions',
    component: MissionsComponent
  },
  {
    path: 'voitures',
    component: VoituresComponent
  }
];
