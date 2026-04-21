export interface Chauffeur {
  id: number;
  nom: string;
  permis: string;
  experience: number;
  imageData?: string;
}

export interface ChauffeurRequest {
  nom: string;
  permis: string;
  experience: number;
  imageData?: string;
}
