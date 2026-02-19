import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

export interface ConfirmState {
  open: boolean;
  title: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class UiFeedbackService {
  toasts = signal<ToastMessage[]>([]);
  confirmState = signal<ConfirmState>({
    open: false,
    title: '',
    message: '',
  });

  private toastId = 0;
  private confirmResolver: ((value: boolean) => void) | null = null;

  toast(text: string, type: ToastType = 'info', durationMs = 3200) {
    const id = ++this.toastId;
    this.toasts.update((list) => [...list, { id, type, text }]);
    setTimeout(() => this.dismissToast(id), durationMs);
  }

  dismissToast(id: number) {
    this.toasts.update((list) => list.filter((item) => item.id !== id));
  }

  confirm(message: string, title = 'Confirmar accion'): Promise<boolean> {
    this.confirmState.set({
      open: true,
      title,
      message,
    });
    return new Promise<boolean>((resolve) => {
      this.confirmResolver = resolve;
    });
  }

  resolveConfirm(result: boolean) {
    this.confirmState.set({
      open: false,
      title: '',
      message: '',
    });
    if (this.confirmResolver) {
      this.confirmResolver(result);
      this.confirmResolver = null;
    }
  }
}
