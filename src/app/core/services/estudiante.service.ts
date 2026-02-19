import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from './api';
import { Estudiante } from '../models/estudiante.model';

@Injectable({ providedIn: 'root' })
export class EstudianteService {
  private http = inject(HttpClient);

  list(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(API.estudiantes);
  }

  get(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${API.estudiantes}/${id}`);
  }

  create(dto: Estudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(API.estudiantes, dto);
  }

  update(id: number, dto: Estudiante): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${API.estudiantes}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API.estudiantes}/${id}`);
  }

  asignarCurso(estudianteId: number, cursoId: number): Observable<Estudiante> {
    return this.http.post<Estudiante>(`${API.estudiantes}/${estudianteId}/cursos/${cursoId}`, {});
  }
}
