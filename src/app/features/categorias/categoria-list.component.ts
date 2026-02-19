import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriaService } from '../../core/services/categoria.service';
import { Categoria } from '../../core/models/categoria.model';
import { UiFeedbackService } from '../../core/services/ui-feedback.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page card">
      <h2 class="page-title">Categorias</h2>

      <div class="actions">
        <a class="btn btn-primary" routerLink="/categorias/nueva">+ Nueva</a>
      </div>

      <ul class="list">
        <li class="list-item" *ngFor="let c of categorias()">
          <div class="item-main">
            <strong>{{ c.nombre }}</strong>
          </div>
          <div class="item-actions">
            <a class="btn btn-outline" [routerLink]="['/categorias', c.id, 'editar']">Editar</a>
            <button class="btn btn-danger" (click)="eliminar(c.id!)">Eliminar</button>
          </div>
        </li>
      </ul>
    </section>
  `,
})
export class CategoriaListComponent {
  private service = inject(CategoriaService);
  private ui = inject(UiFeedbackService);
  categorias = signal<Categoria[]>([]);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.service.list().subscribe((data) => this.categorias.set(data));
  }

  async eliminar(id: number) {
    const ok = await this.ui.confirm('Se eliminara la categoria seleccionada.');
    if (!ok) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.ui.toast('Categoria eliminada', 'success');
        this.cargar();
      },
      error: () => this.ui.toast('No se pudo eliminar la categoria', 'error'),
    });
  }
}
