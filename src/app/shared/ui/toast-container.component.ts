import { Component, inject } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  standalone: true,
  selector: 'app-toast-container',
  imports: [NgFor, NgClass],
  styles: [`
    /* === Positionierung === */
    .toast-container {
      position: fixed;
      top: 5rem;
      right: 1rem;
      z-index: 3000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: none; /* nicht blockierend */
    }

    /* === Basisstyle unserer Toasts === */
    .app-toast {
      pointer-events: auto;
      opacity: 0;
      /*transform: translateY(-10px);*/
      transform: translateY(12px);
      transition: opacity .35s ease, transform .35s ease;
      min-width: 260px;
      border-radius: 0.5rem;
      color: #fff;
      padding: 0.75rem 1rem;
      box-shadow: 0 6px 18px rgba(0,0,0,.15);
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* === Ein-/Ausblendung === */
    .app-toast.app-toast-show {
      opacity: 1;
      transform: translateY(0);
    }
    .app-toast.app-toast-hide {
      opacity: 0;
      transform: translateY(-10px);
    }

    /* === Farbschemata === */
    .bg-success   { background-color: #198754; }
    .bg-info      { background-color: #0dcaf0; color: #000; }
    .bg-danger    { background-color: #dc3545; }

    .toast-icon {
      margin-right: .5rem;
      font-size: 1.25rem;
    }
  `],
  template: `
  <div class="toast-container">
    <div *ngFor="let t of toastService.toasts()"
         role="status" aria-live="polite"
         class="app-toast"
         [ngClass]="{
           'bg-success': t.type === 'success',
           'bg-info':    t.type === 'info',
           'bg-danger':  t.type === 'danger',
           'app-toast-show': t.enter && !t.hiding,
           'app-toast-hide': t.hiding
         }">
      <div class="d-flex align-items-center flex-grow-1 me-2">
        <span class="toast-icon">{{ icon(t.type) }}</span>
        <span>{{ t.message }}</span>
      </div>
      <button type="button" class="btn-close btn-close-white ms-2"
              (click)="toastService.hide(t.id)"></button>
    </div>
  </div>
  `
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  icon(type?: string) {
    switch (type) {
      case 'success': return '✅';
      case 'danger':  return '⚠️';
      default:        return 'ℹ️';
    }
  }
}