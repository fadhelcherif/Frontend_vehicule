import { Routes } from '@angular/router';
import { VoituresComponent } from './pages/voiture/voitures/voitures.component';
import { ChauffeursComponent } from './pages/chauffeur/chauffeurs/chauffeurs.component';

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
    path: 'voitures',
    component: VoituresComponent
  }
];
