import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    return this.http.get<{ success: boolean; data: Mission[] }>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  getById(id: number): Observable<Mission> {
    return this.http.get<{ success: boolean; data: Mission }>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  create(request: MissionRequest): Observable<Mission> {
    return this.http.post<{ success: boolean; data: Mission }>(this.apiUrl, request)
      .pipe(map(response => response.data));
  }

  update(id: number, request: MissionRequest): Observable<Mission> {
    return this.http.put<{ success: boolean; data: Mission }>(`${this.apiUrl}/${id}`, request)
      .pipe(map(response => response.data));
  }

  updateAffectation(missionId: number, request: AffectationRequest): Observable<Mission> {
    return this.http.put<{ success: boolean; data: Mission }>(`${this.apiUrl}/${missionId}/affectation`, request)
      .pipe(map(response => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
