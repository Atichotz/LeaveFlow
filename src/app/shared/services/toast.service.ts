import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning';

export interface Toast {
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly current = signal<Toast | null>(null);

  show(message: string, type: ToastType = 'success', duration = 3000): void {
    this.current.set({ message, type });
    setTimeout(() => this.current.set(null), duration);
  }
}
