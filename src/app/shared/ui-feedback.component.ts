import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFeedbackService } from '../core/services/ui-feedback.service';

@Component({
  selector: 'app-ui-feedback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-stack" *ngIf="ui.toasts().length">
      <div class="toast" *ngFor="let item of ui.toasts()" [class]="'toast toast-' + item.type">
        <span>{{ item.text }}</span>
        <button type="button" class="toast-close" (click)="ui.dismissToast(item.id)">x</button>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="ui.confirmState().open">
      <div class="modal-card">
        <h3>{{ ui.confirmState().title }}</h3>
        <p>{{ ui.confirmState().message }}</p>
        <div class="actions">
          <button class="btn btn-danger" type="button" (click)="ui.resolveConfirm(true)">Aceptar</button>
          <button class="btn btn-outline" type="button" (click)="ui.resolveConfirm(false)">Cancelar</button>
        </div>
      </div>
    </div>
  `,
})
export class UiFeedbackComponent {
  ui = inject(UiFeedbackService);
}
