import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Mission, MissionRequest } from '../../models/mission/mission.model';
import { environment } from '../../../environments/environment';

export interface AffectationRequest {
  vehiculeId: number;
  chauffeurId: number;
}

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private apiUrl = environment.apiUrl + '/api/missions';
  private missionsChangedSource = new Subject<void>();
  missionsChanged$ = this.missionsChangedSource.asObservable();

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
      .pipe(map(response => response.data), tap(() => this.missionsChangedSource.next()));
  }

  update(id: number, request: MissionRequest): Observable<Mission> {
    return this.http.put<{ success: boolean; data: Mission }>(`${this.apiUrl}/${id}`, request)
      .pipe(map(response => response.data), tap(() => this.missionsChangedSource.next()));
  }

  updateAffectation(missionId: number, request: AffectationRequest): Observable<Mission> {
    return this.http.put<{ success: boolean; data: Mission }>(`${this.apiUrl}/${missionId}/affectation`, request)
      .pipe(map(response => response.data), tap(() => this.missionsChangedSource.next()));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.missionsChangedSource.next()));
  }
}
