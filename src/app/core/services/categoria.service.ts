import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from './api';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);

  list(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(API.categorias);
  }

  get(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${API.categorias}/${id}`);
  }

  create(dto: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(API.categorias, dto);
  }

  update(id: number, dto: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${API.categorias}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API.categorias}/${id}`);
  }
}
