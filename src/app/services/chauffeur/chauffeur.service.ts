import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chauffeur, ChauffeurRequest } from '../../models/chauffeur/chauffeur.model';

@Injectable({
  providedIn: 'root'
})
export class ChauffeurService {
  private apiUrl = '/api/chauffeurs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Chauffeur[]> {
    return this.http.get<Chauffeur[]>(this.apiUrl);
  }

  getById(id: number): Observable<Chauffeur> {
    return this.http.get<Chauffeur>(`${this.apiUrl}/${id}`);
  }

  create(request: ChauffeurRequest): Observable<Chauffeur> {
    return this.http.post<Chauffeur>(this.apiUrl, request);
  }

  update(id: number, request: ChauffeurRequest): Observable<Chauffeur> {
    return this.http.put<Chauffeur>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadImage(id: number, file: File): Observable<Chauffeur> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Chauffeur>(`${this.apiUrl}/${id}/image`, formData);
  }
}
