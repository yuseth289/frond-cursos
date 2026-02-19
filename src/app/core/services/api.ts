import { environment } from '../../../environments/environment';

export const API = {
  base: environment.apiUrl,
  categorias: `${environment.apiUrl}/categorias`,
  cursos: `${environment.apiUrl}/cursos`,
  estudiantes: `${environment.apiUrl}/estudiantes`,
};
