import { Routes } from '@angular/router';
import { VoituresComponent } from './pages/voiture/voitures/voitures.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'voitures',
    component: VoituresComponent
  }
];
