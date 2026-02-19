import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CursoService } from '../../core/services/curso.service';
import { Curso } from '../../core/models/curso.model';
import { UiFeedbackService } from '../../core/services/ui-feedback.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page card">
      <h2 class="page-title">Cursos</h2>

      <div class="actions">
        <a class="btn btn-primary" routerLink="/cursos/nuevo">+ Nuevo</a>
      </div>

      <ul class="list">
        <li class="list-item" *ngFor="let c of cursos()">
          <div class="item-main">
            <strong>{{ c.titulo }}</strong>
            <span class="meta">
              {{ c.descripcion }} |
              {{ c.categoriaNombre ? ('categoria: ' + c.categoriaNombre) : ('catId: ' + c.categoriaId) }}
            </span>
          </div>
          <div class="item-actions">
            <a class="btn btn-outline" [routerLink]="['/cursos', c.id, 'editar']">Editar</a>
            <button class="btn btn-danger" (click)="eliminar(c.id!)">Eliminar</button>
          </div>
        </li>
      </ul>
    </section>
  `,
})
export class CursoListComponent {
  private service = inject(CursoService);
  private ui = inject(UiFeedbackService);
  cursos = signal<Curso[]>([]);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.service.list().subscribe((data) => this.cursos.set(data));
  }

  async eliminar(id: number) {
    const ok = await this.ui.confirm('Se eliminara el curso seleccionado.');
    if (!ok) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.ui.toast('Curso eliminado', 'success');
        this.cargar();
      },
      error: () => this.ui.toast('No se pudo eliminar el curso', 'error'),
    });
  }
}
