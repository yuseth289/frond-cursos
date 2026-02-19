import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoriaService } from '../../core/services/categoria.service';
import { UiFeedbackService } from '../../core/services/ui-feedback.service';
import { Categoria } from '../../core/models/categoria.model';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="page card">
      <h2 class="page-title">{{ isEdit() ? 'Editar' : 'Nueva' }} Categoria</h2>

      <form class="form-grid" [formGroup]="form" (ngSubmit)="guardar()">
        <div class="field">
          <label>Nombre</label>
          <input formControlName="nombre" (input)="validarDuplicado()" />
          <div class="error" *ngIf="form.controls.nombre.touched && form.controls.nombre.invalid">
            Nombre es obligatorio
          </div>
          <div class="error" *ngIf="nombreDuplicado()">
            Ya existe una categoria con ese nombre
          </div>
        </div>

        <div class="actions">
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid || nombreDuplicado()">Guardar</button>
          <a class="btn btn-outline" routerLink="/categorias">Volver</a>
        </div>
      </form>
    </section>
  `,
})
export class CategoriaFormComponent {
  private fb = inject(FormBuilder);
  private service = inject(CategoriaService);
  private ui = inject(UiFeedbackService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = signal(false);
  nombreDuplicado = signal(false);
  private categoriasExistentes = signal<Categoria[]>([]);
  id?: number;

  form = this.fb.group({
    nombre: ['', [Validators.required]],
  });

  ngOnInit() {
    this.service.list().subscribe({
      next: (categorias) => {
        this.categoriasExistentes.set(categorias);
        this.validarDuplicado();
      },
      error: () => this.categoriasExistentes.set([]),
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit.set(true);
      this.id = Number(idParam);
      this.service.get(this.id).subscribe((c) => {
        this.form.patchValue(c);
        this.validarDuplicado();
      });
    }
  }

  guardar() {
    this.validarDuplicado();
    if (this.nombreDuplicado()) {
      this.ui.toast('Ya existe una categoria con ese nombre', 'warning');
      return;
    }

    const dto = this.form.getRawValue() as { nombre: string };
    if (this.isEdit() && this.id != null) {
      this.service.update(this.id, dto).subscribe({
        next: () => {
          this.ui.toast('Categoria actualizada', 'success');
          this.router.navigateByUrl('/categorias');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error actualizando categoria', err);
          this.ui.toast(this.obtenerMensajeError(err, 'No se pudo actualizar la categoria'), 'error');
        },
      });
    } else {
      this.service.create(dto).subscribe({
        next: () => {
          this.ui.toast('Categoria guardada', 'success');
          this.router.navigateByUrl('/categorias');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error creando categoria', err);
          this.ui.toast(this.obtenerMensajeError(err, 'No se pudo guardar la categoria'), 'error');
        },
      });
    }
  }

  validarDuplicado() {
    const nombreActual = this.normalizarNombre(this.form.controls.nombre.value);
    if (!nombreActual) {
      this.nombreDuplicado.set(false);
      return;
    }

    const existe = this.categoriasExistentes().some((categoria) => {
      if (!categoria.nombre) return false;
      if (this.isEdit() && categoria.id === this.id) return false;
      return this.normalizarNombre(categoria.nombre) === nombreActual;
    });

    this.nombreDuplicado.set(existe);
  }

  private normalizarNombre(nombre: string | null | undefined): string {
    return (nombre ?? '').trim().toLowerCase();
  }

  private obtenerMensajeError(err: HttpErrorResponse, fallback: string): string {
    const message = err?.error?.message;
    return typeof message === 'string' && message.trim().length > 0 ? message : fallback;
  }
}
