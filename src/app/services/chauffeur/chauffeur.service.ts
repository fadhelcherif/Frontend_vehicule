import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Chauffeur, ChauffeurRequest } from '../../models/chauffeur/chauffeur.model';

@Injectable({
  providedIn: 'root'
})
export class ChauffeurService {
  private apiUrl = '/api/chauffeurs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Chauffeur[]> {
    return this.http.get<{ success: boolean; data: Chauffeur[] }>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  getById(id: number): Observable<Chauffeur> {
    return this.http.get<{ success: boolean; data: Chauffeur }>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  create(request: ChauffeurRequest): Observable<Chauffeur> {
    return this.http.post<{ success: boolean; data: Chauffeur }>(this.apiUrl, request)
      .pipe(map(response => response.data));
  }

  update(id: number, request: ChauffeurRequest): Observable<Chauffeur> {
    return this.http.put<{ success: boolean; data: Chauffeur }>(`${this.apiUrl}/${id}`, request)
      .pipe(map(response => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadImage(id: number, file: File): Observable<Chauffeur> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ success: boolean; data: Chauffeur }>(`${this.apiUrl}/${id}/image`, formData)
      .pipe(map(response => response.data));
  }
}
