import { Routes } from '@angular/router';
import { CategoriaListComponent } from './features/categorias/categoria-list.component';
import { CategoriaFormComponent } from './features/categorias/categoria-form.component';
import { CursoListComponent } from './features/cursos/curso-list.component';
import { CursoFormComponent } from './features/cursos/curso-form.component';
import { EstudianteListComponent } from './features/estudiantes/estudiante-list.component';
import { EstudianteFormComponent } from './features/estudiantes/estudiante-form.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'categorias' },
  { path: 'categorias', component: CategoriaListComponent },
  { path: 'categorias/nueva', component: CategoriaFormComponent },
  { path: 'categorias/:id/editar', component: CategoriaFormComponent },
  { path: 'cursos', component: CursoListComponent },
  { path: 'cursos/nuevo', component: CursoFormComponent },
  { path: 'cursos/:id/editar', component: CursoFormComponent },
  { path: 'estudiantes', component: EstudianteListComponent },
  { path: 'estudiantes/nuevo', component: EstudianteFormComponent },
  { path: 'estudiantes/:id/editar', component: EstudianteFormComponent },
  { path: '**', redirectTo: 'categorias' },
];
