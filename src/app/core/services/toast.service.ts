import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'info' | 'danger' | 'warning';
  enter?: boolean;   // ⬅️ für Fade-in
  hiding?: boolean;  // ⬅️ für Fade-out
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private listSig = signal<Toast[]>([]);
  readonly toasts = this.listSig.asReadonly();

  show(message: string, type: 'success' | 'info' | 'danger' | 'warning' = 'success', ms = 1000) {
    const toast: Toast = { id: Date.now(), message, type, enter: false, hiding: false };
    this.listSig.update(list => [...list, toast]);
  
    // Zwei Frames warten -> garantiert, dass das Element im DOM ist,
    // dann enter=true setzen (startet Transition zuverlässig)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.listSig.update(list => list.map(t => t.id === toast.id ? ({ ...t, enter: true }) : t));
      });
    });
  
    setTimeout(() => this.hide(toast.id), ms);
  }

  hide(id: number) {
    this.listSig.update(list => list.map(t => t.id === id ? { ...t, hiding: true } : t));
    // Zeit für Fade-out (muss zu CSS-Dauer passen)
    setTimeout(() => this.dismiss(id), 300);
  }

  dismiss(id: number) {
    this.listSig.update(list => list.filter(t => t.id !== id));
  }
}