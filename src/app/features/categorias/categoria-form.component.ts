import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoriaService } from '../../core/services/categoria.service';
import { UiFeedbackService } from '../../core/services/ui-feedback.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="page card">
      <h2 class="page-title">{{ isEdit() ? 'Editar' : 'Nueva' }} Categoria</h2>

      <form class="form-grid" [formGroup]="form" (ngSubmit)="guardar()">
        <div class="field">
          <label>Nombre</label>
          <input formControlName="nombre" />
          <div class="error" *ngIf="form.controls.nombre.touched && form.controls.nombre.invalid">
            Nombre es obligatorio
          </div>
        </div>

        <div class="actions">
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Guardar</button>
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
  id?: number;

  form = this.fb.group({
    nombre: ['', [Validators.required]],
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit.set(true);
      this.id = Number(idParam);
      this.service.get(this.id).subscribe((c) => this.form.patchValue(c));
    }
  }

  guardar() {
    const dto = this.form.getRawValue() as { nombre: string };
    if (this.isEdit() && this.id != null) {
      this.service.update(this.id, dto).subscribe({
        next: () => {
          this.ui.toast('Categoria actualizada', 'success');
          this.router.navigateByUrl('/categorias');
        },
        error: (err) => {
          console.error('Error actualizando categoria', err);
          this.ui.toast('No se pudo actualizar la categoria', 'error');
        },
      });
    } else {
      this.service.create(dto).subscribe({
        next: () => {
          this.ui.toast('Categoria guardada', 'success');
          this.router.navigateByUrl('/categorias');
        },
        error: (err) => {
          console.error('Error creando categoria', err);
          this.ui.toast('No se pudo guardar la categoria', 'error');
        },
      });
    }
  }
}
