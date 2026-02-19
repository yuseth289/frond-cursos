import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EstudianteService } from '../../core/services/estudiante.service';
import { Estudiante } from '../../core/models/estudiante.model';
import { UiFeedbackService } from '../../core/services/ui-feedback.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page card">
      <h2 class="page-title">Estudiantes</h2>

      <div class="actions">
        <a class="btn btn-primary" routerLink="/estudiantes/nuevo">+ Nuevo</a>
      </div>

      <ul class="list">
        <li class="list-item" *ngFor="let e of estudiantes()">
          <div class="item-main">
            <strong>{{ e.nombre }}</strong>
            <span class="meta">{{ e.email }}</span>
            <span class="meta">
              {{
                e.cursos?.length
                  ? ('cursos: ' + (e.cursos ?? []).join(', '))
                  : ('cursosIds: ' + (e.cursosIds?.join(', ') || ''))
              }}
            </span>
          </div>
          <div class="item-actions">
            <a class="btn btn-outline" [routerLink]="['/estudiantes', e.id, 'editar']">Editar</a>
            <button class="btn btn-danger" (click)="eliminar(e.id!)">Eliminar</button>
          </div>
        </li>
      </ul>
    </section>
  `,
})
export class EstudianteListComponent {
  private service = inject(EstudianteService);
  private ui = inject(UiFeedbackService);
  estudiantes = signal<Estudiante[]>([]);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.service.list().subscribe((data) => this.estudiantes.set(data));
  }

  async eliminar(id: number) {
    const ok = await this.ui.confirm('Se eliminara el estudiante seleccionado.');
    if (!ok) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.ui.toast('Estudiante eliminado', 'success');
        this.cargar();
      },
      error: () => this.ui.toast('No se pudo eliminar el estudiante', 'error'),
    });
  }
}
