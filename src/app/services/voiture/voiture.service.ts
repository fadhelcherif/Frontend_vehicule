import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Voiture, VoitureRequest, MaintenanceAlert } from '../../models/voiture/voiture.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoitureService {
  private apiUrl = environment.apiUrl + '/api/vehicules';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Voiture[]> {
    return this.http.get<{ success: boolean; data: Voiture[] }>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  getById(id: number): Observable<Voiture> {
    return this.http.get<{ success: boolean; data: Voiture }>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  create(request: VoitureRequest): Observable<Voiture> {
    return this.http.post<{ success: boolean; data: Voiture }>(this.apiUrl, request)
      .pipe(map(response => response.data));
  }

  update(id: number, request: VoitureRequest): Observable<Voiture> {
    return this.http.put<{ success: boolean; data: Voiture }>(`${this.apiUrl}/${id}`, request)
      .pipe(map(response => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadImage(id: number, file: File): Observable<Voiture> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ success: boolean; data: Voiture }>(`${this.apiUrl}/${id}/image`, formData)
      .pipe(map(response => response.data));
  }

  getMaintenanceAlerts(thresholdKm?: number): Observable<MaintenanceAlert[]> {
    const params = thresholdKm ? `?thresholdKm=${thresholdKm}` : '';
    return this.http
      .get<{ success: boolean; data: MaintenanceAlert[] }>(`${this.apiUrl}/maintenance/alerts${params}`)
      .pipe(map(response => response.data));
  }
}
