import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consommation, ConsommationRequest } from '../../models/consommation/consommation.model';

@Injectable({
  providedIn: 'root'
})
export class ConsommationService {
  private apiUrl = '/api/consommations';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Consommation[]> {
    return this.http.get<Consommation[]>(this.apiUrl);
  }

  getById(id: number): Observable<Consommation> {
    return this.http.get<Consommation>(`${this.apiUrl}/${id}`);
  }

  create(request: ConsommationRequest): Observable<Consommation> {
    return this.http.post<Consommation>(this.apiUrl, request);
  }

  update(id: number, request: ConsommationRequest): Observable<Consommation> {
    return this.http.put<Consommation>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
