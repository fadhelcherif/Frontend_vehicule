import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FuelCostByVehiculeResponse, VehiculeActivityResponse } from '../../models/dashboard/dashboard.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl + '/api/dashboard';

  constructor(private http: HttpClient) {}

  ping(): Observable<string> {
    return this.http.get(`${this.apiUrl}/ping`, { responseType: 'text' });
  }

  getFuelCostsByVehicule(): Observable<FuelCostByVehiculeResponse[]> {
    return this.http
      .get<{ success: boolean; data: FuelCostByVehiculeResponse[] }>(`${this.apiUrl}/fuel-costs`)
      .pipe(map(response => response.data));
  }

  getMostActiveVehicules(limit?: number): Observable<VehiculeActivityResponse[]> {
    const params = limit != null ? new HttpParams().set('limit', String(limit)) : undefined;
    return this.http
      .get<{ success: boolean; data: VehiculeActivityResponse[] }>(`${this.apiUrl}/vehicules/most-active`, { params })
      .pipe(map(response => response.data));
  }
}
