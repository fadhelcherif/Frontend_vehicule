export interface Mission {
  id: number;
  vehiculeId: number;
  vehiculeImmatriculation: string;
  chauffeurId: number;
  chauffeurNom: string;
  pointDepart: string;
  destination: string;
  distance: number;
}

export interface MissionRequest {
  vehiculeId: number;
  chauffeurId: number;
  pointDepart: string;
  destination: string;
  distance: number;
}
