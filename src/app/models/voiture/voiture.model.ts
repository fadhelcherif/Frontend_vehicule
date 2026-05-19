export interface Voiture {
  id: number;
  immatriculation: string;
  modele: string;
  type: string;
  kilometrage: number;
  statut: string;
  imageData?: string;
}

export interface VoitureRequest {
  immatriculation: string;
  modele: string;
  type: string;
  kilometrage: number;
  statut: string;
  imageData?: string;
}

export interface MaintenanceAlert {
  vehiculeId: number;
  // legacy id alias (optional)
  id?: number;
  immatriculation: string;
  modele: string;
  kilometrage: number;
  // matches backend field names
  seuilKm: number;
  depassementKm: number;
  statut: string;
}
