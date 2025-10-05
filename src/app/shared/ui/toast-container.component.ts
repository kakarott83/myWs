import { Component, inject } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  standalone: true,
  selector: 'app-toast-container',
  imports: [NgFor, NgClass],
  styles: [`
    .toast-container { z-index: 2000 !important; }
    .toast {
      opacity: 0;
      transform: translateY(12px);
      transition: opacity .3s ease, transform .3s ease;
      box-shadow: 0 6px 18px rgba(0,0,0,.15);
    }
    .toast.toast-show {
      opacity: 1;
      transform: translateY(0);
    }
    .toast.toast-hide {
      opacity: 0;
      transform: translateY(12px);
    }
  `],
  template: `
  <div class="toast-container position-fixed top-0 end-0 p-3">
  <div class="text-danger small">DEBUG: {{ toastService.toasts().length }}</div>
    <div *ngFor="let t of toastService.toasts()"
         role="status" aria-live="polite"
         class="toast align-items-center text-white border-0 mb-2"
         [ngClass]="{
           'bg-success': t.type === 'success',
           'bg-info':    t.type === 'info',
           'bg-danger':  t.type === 'danger',
           'toast-show': t.enter && !t.hiding,
           'toast-hide': t.hiding
         }">
      <div class="d-flex">
        <div class="toast-body">{{ t.message }}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto"
                (click)="toastService.hide(t.id)"></button>
      </div>
    </div>
  </div>
  `
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}