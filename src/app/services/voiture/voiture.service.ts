import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Voiture, VoitureRequest, MaintenanceAlert } from '../../models/voiture/voiture.model';

@Injectable({
  providedIn: 'root'
})
export class VoitureService {
  private apiUrl = '/api/vehicules';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Voiture[]> {
    return this.http.get<Voiture[]>(this.apiUrl);
  }

  getById(id: number): Observable<Voiture> {
    return this.http.get<Voiture>(`${this.apiUrl}/${id}`);
  }

  create(request: VoitureRequest): Observable<Voiture> {
    return this.http.post<Voiture>(this.apiUrl, request);
  }

  update(id: number, request: VoitureRequest): Observable<Voiture> {
    return this.http.put<Voiture>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadImage(id: number, file: File): Observable<Voiture> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Voiture>(`${this.apiUrl}/${id}/image`, formData);
  }

  getMaintenanceAlerts(thresholdKm?: number): Observable<MaintenanceAlert[]> {
    const params = thresholdKm ? `?thresholdKm=${thresholdKm}` : '';
    return this.http.get<MaintenanceAlert[]>(`${this.apiUrl}/maintenance/alerts${params}`);
  }
}
