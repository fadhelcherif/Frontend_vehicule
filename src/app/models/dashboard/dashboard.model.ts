export interface FuelCostByVehiculeResponse {
  vehiculeId: number;
  immatriculation: string;
  coutTotalCarburant: number;
}

// Keep flexible typing to absorb backend naming differences safely.
export interface VehiculeActivityResponse {
  vehiculeId?: number;
  immatriculation?: string;
  totalMissions?: number;
  nombreMissions?: number;
  distanceTotale?: number;
  totalDistance?: number;
  [key: string]: string | number | null | undefined;
}
