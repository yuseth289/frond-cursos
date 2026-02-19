export interface Estudiante {
  id?: number;
  nombre: string;
  email: string;
  cursosIds?: number[];
  cursos?: string[];
}
