import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Consommation, ConsommationRequest } from '../../models/consommation/consommation.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsommationService {
  private apiUrl = environment.apiUrl + '/api/consommations';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Consommation[]> {
    return this.http.get<{ success: boolean; data: Consommation[] }>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  getById(id: number): Observable<Consommation> {
    return this.http.get<{ success: boolean; data: Consommation }>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  create(request: ConsommationRequest): Observable<Consommation> {
    return this.http.post<{ success: boolean; data: Consommation }>(this.apiUrl, request)
      .pipe(map(response => response.data));
  }

  update(id: number, request: ConsommationRequest): Observable<Consommation> {
    return this.http.put<{ success: boolean; data: Consommation }>(`${this.apiUrl}/${id}`, request)
      .pipe(map(response => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
