import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mission, MissionRequest } from '../../models/mission/mission.model';

export interface AffectationRequest {
  vehiculeId: number;
  chauffeurId: number;
}

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private apiUrl = '/api/missions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Mission[]> {
    return this.http.get<Mission[]>(this.apiUrl);
  }

  getById(id: number): Observable<Mission> {
    return this.http.get<Mission>(`${this.apiUrl}/${id}`);
  }

  create(request: MissionRequest): Observable<Mission> {
    return this.http.post<Mission>(this.apiUrl, request);
  }

  update(id: number, request: MissionRequest): Observable<Mission> {
    return this.http.put<Mission>(`${this.apiUrl}/${id}`, request);
  }

  updateAffectation(missionId: number, request: AffectationRequest): Observable<Mission> {
    return this.http.put<Mission>(`${this.apiUrl}/${missionId}/affectation`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
