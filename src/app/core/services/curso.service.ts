import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from './api';
import { Curso } from '../models/curso.model';

@Injectable({ providedIn: 'root' })
export class CursoService {
  private http = inject(HttpClient);

  list(): Observable<Curso[]> {
    return this.http.get<Curso[]>(API.cursos);
  }

  get(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${API.cursos}/${id}`);
  }

  create(dto: Curso): Observable<Curso> {
    return this.http.post<Curso>(API.cursos, dto);
  }

  update(id: number, dto: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${API.cursos}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API.cursos}/${id}`);
  }
}
