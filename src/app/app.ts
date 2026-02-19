import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiFeedbackComponent } from './shared/ui-feedback.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, UiFeedbackComponent],
  template: `
    <main class="layout">
      <header class="app-header">
        <h1>Proyecto Cursos</h1>
        <nav class="main-nav">
          <a class="nav-link" routerLink="/categorias">Categorias</a>
          <a class="nav-link" routerLink="/cursos">Cursos</a>
          <a class="nav-link" routerLink="/estudiantes">Estudiantes</a>
        </nav>
      </header>

      <router-outlet />
      <app-ui-feedback />
    </main>
  `,
  styleUrl: './app.scss',
})
export class App {
}
