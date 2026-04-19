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
  id: number;
  immatriculation: string;
  modele: string;
  kilometrage: number;
  seuil: number;
  km_depassement: number;
  statut: string;
}
