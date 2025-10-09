import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { PricePipe } from '../../shared/pipes/price.pipes';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-cart.page',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, PricePipe],
  templateUrl: './cart.page.component.html',
  styleUrl: './cart.page.component.css'
})
export class CartPageComponent {
  cart = inject(CartService);
  private toast = inject(ToastService);

  inc(id: string, qty: number) {
    this.cart.update(id, qty + 1);
  }
  dec(id: string, qty: number) {
    if (qty > 1) this.cart.update(id, qty - 1);
  }
  onQtyInput(id: string, ev: Event) {
    const val = (ev.target as HTMLInputElement).valueAsNumber;
    if (Number.isFinite(val) && val >= 1) this.cart.update(id, val);
  }

  remove(id: string, name: string) {
    if(id) {
      this.cart.remove(id);
      this.toast.show(`${name} wurde aus den Warenkorb entfernt.`, 'danger');
    }
  }
}
