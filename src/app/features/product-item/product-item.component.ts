import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../shared/models/product.model';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})

export class ProductItemComponent {

  private cart = inject(CartService);
  private toast = inject(ToastService);

  @Input() item!: Product;

  add() {
    if (this.item) {
      this.cart.add(this.item, 1);
      this.toast.show(`${this.item.name} wurde in den Warenkorb gelegt.`, 'success');
    }
  }


}
