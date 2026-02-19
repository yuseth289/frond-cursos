import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CursoService } from '../../core/services/curso.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { Categoria } from '../../core/models/categoria.model';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="page card">
      <h2 class="page-title">{{ isEdit() ? 'Editar' : 'Nuevo' }} Curso</h2>

      <form class="form-grid" [formGroup]="form" (ngSubmit)="guardar()">
        <div class="field">
          <label>Titulo</label>
          <input formControlName="titulo" />
        </div>

        <div class="field">
          <label>Descripcion</label>
          <textarea formControlName="descripcion"></textarea>
        </div>

        <div class="field">
          <label>Categoria</label>
          <select formControlName="categoriaId">
            <option [ngValue]="null">-- Selecciona --</option>
            <option *ngFor="let cat of categorias()" [ngValue]="cat.id">{{ cat.nombre }}</option>
          </select>
        </div>

        <div class="actions">
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Guardar</button>
          <a class="btn btn-outline" routerLink="/cursos">Volver</a>
        </div>
      </form>
    </section>
  `,
})
export class CursoFormComponent {
  private fb = inject(FormBuilder);
  private cursoService = inject(CursoService);
  private categoriaService = inject(CategoriaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categorias = signal<Categoria[]>([]);
  isEdit = signal(false);
  id?: number;

  form = this.fb.group({
    titulo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    categoriaId: [null as number | null, [Validators.required]],
  });

  ngOnInit() {
    this.categoriaService.list().subscribe((c) => this.categorias.set(c));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit.set(true);
      this.id = Number(idParam);
      this.cursoService.get(this.id).subscribe((c) => this.form.patchValue(c));
    }
  }

  guardar() {
    const raw = this.form.getRawValue();
    const dto = {
      titulo: raw.titulo!,
      descripcion: raw.descripcion!,
      categoriaId: raw.categoriaId!,
    };

    if (this.isEdit() && this.id != null) {
      this.cursoService.update(this.id, dto).subscribe(() => this.router.navigateByUrl('/cursos'));
    } else {
      this.cursoService.create(dto).subscribe(() => this.router.navigateByUrl('/cursos'));
    }
  }
}
