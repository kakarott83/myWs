import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'info' | 'danger';
  enter?: boolean;   // ⬅️ für Fade-in
  hiding?: boolean;  // ⬅️ für Fade-out
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private listSig = signal<Toast[]>([]);
  readonly toasts = this.listSig.asReadonly();

  show(message: string, type: 'success' | 'info' | 'danger' = 'success', ms = 3000) {
    const toast: Toast = { id: Date.now(), message, type, enter: false, hiding: false };
    this.listSig.update(list => [...list, toast]);
    console.log('Toast added', this.listSig().length);

    // Nächster Tick: enter=true -> triggert CSS-Transition (Fade-in)
    setTimeout(() => {
      this.listSig.update(list => list.map(t => t.id === toast.id ? { ...t, enter: true } : t));
    }, 0);

    // Nach Laufzeit: Fade-out einleiten
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