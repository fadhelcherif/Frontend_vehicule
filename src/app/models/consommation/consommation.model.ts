export interface Consommation {
  id: number;
  vehiculeId: number;
  vehiculeImmatriculation: string;
  date: string;
  quantiteCarburant: number;
  coutTotal: number;
}

export interface ConsommationRequest {
  vehiculeId: number;
  date: string;
  quantiteCarburant: number;
  coutTotal: number;
}
