import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EstudianteService } from '../../core/services/estudiante.service';
import { CursoService } from '../../core/services/curso.service';
import { Curso } from '../../core/models/curso.model';
import { UiFeedbackService } from '../../core/services/ui-feedback.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="page card">
      <h2 class="page-title">{{ isEdit() ? 'Editar' : 'Nuevo' }} Estudiante</h2>

      <form class="form-grid" [formGroup]="form" (ngSubmit)="guardar()">
        <div class="field">
          <label>Nombre</label>
          <input formControlName="nombre" />
        </div>

        <div class="field">
          <label>Email</label>
          <input formControlName="email" />
        </div>

        <div class="field">
          <label>Cursos (selecciona varios)</label>
          <select multiple (change)="onCursosChange($event)">
            <option *ngFor="let c of cursos()" [value]="c.id">{{ c.titulo }}</option>
          </select>
          <p class="helper">Seleccionados: {{ cursosSeleccionados().join(', ') || 'ninguno' }}</p>
        </div>

        <div class="actions">
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Guardar</button>
          <a class="btn btn-outline" routerLink="/estudiantes">Volver</a>
        </div>
      </form>

      <hr />

      <h3>Asignar curso rapido</h3>
      <div class="actions">
        <input
          type="number"
          [(ngModel)]="cursoIdAsignar"
          name="cursoIdAsignar"
          placeholder="CursoId"
          style="max-width: 180px;"
        />
        <button class="btn btn-outline" (click)="asignarCurso()">Asignar</button>
      </div>
    </section>
  `,
})
export class EstudianteFormComponent {
  private fb = inject(FormBuilder);
  private estudianteService = inject(EstudianteService);
  private cursoService = inject(CursoService);
  private ui = inject(UiFeedbackService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  cursos = signal<Curso[]>([]);
  cursosSeleccionados = signal<number[]>([]);
  isEdit = signal(false);
  id?: number;

  cursoIdAsignar = 0;

  form = this.fb.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    this.cursoService.list().subscribe((c) => this.cursos.set(c));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit.set(true);
      this.id = Number(idParam);
      this.estudianteService.get(this.id).subscribe((e) => {
        this.form.patchValue({ nombre: e.nombre, email: e.email });
        this.cursosSeleccionados.set(e.cursosIds ?? []);
      });
    }
  }

  onCursosChange(evt: Event) {
    const select = evt.target as HTMLSelectElement;
    const selectedIds = Array.from(select.selectedOptions).map((o) => Number(o.value));
    this.cursosSeleccionados.set(selectedIds);
  }

  guardar() {
    const raw = this.form.getRawValue();
    const dto = {
      nombre: raw.nombre!,
      email: raw.email!,
      cursosIds: this.cursosSeleccionados(),
    };

    if (this.isEdit() && this.id != null) {
      this.estudianteService.update(this.id, dto).subscribe({
        next: () => {
          this.ui.toast('Estudiante actualizado', 'success');
          this.router.navigateByUrl('/estudiantes');
        },
        error: () => this.ui.toast('No se pudo actualizar el estudiante', 'error'),
      });
    } else {
      this.estudianteService.create(dto).subscribe({
        next: () => {
          this.ui.toast('Estudiante guardado', 'success');
          this.router.navigateByUrl('/estudiantes');
        },
        error: () => this.ui.toast('No se pudo guardar el estudiante', 'error'),
      });
    }
  }

  asignarCurso() {
    if (!this.id) {
      this.ui.toast('Primero crea o abre un estudiante existente', 'warning');
      return;
    }
    if (!this.cursoIdAsignar) {
      this.ui.toast('Ingresa un cursoId valido', 'warning');
      return;
    }
    this.estudianteService.asignarCurso(this.id, this.cursoIdAsignar).subscribe({
      next: () => {
        this.ui.toast('Curso asignado', 'success');
        const actual = this.cursosSeleccionados();
        if (!actual.includes(this.cursoIdAsignar)) {
          this.cursosSeleccionados.set([...actual, this.cursoIdAsignar]);
        }
      },
      error: () => this.ui.toast('No se pudo asignar el curso', 'error'),
    });
  }
}
