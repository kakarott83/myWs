import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { PricePipe } from '../../../shared/pipes/price.pipes';
import { inject } from '@angular/core';

@Component({
  selector: 'app-product.page',
  standalone: true,
  imports: [NgIf, PricePipe],
  templateUrl: './product.page.component.html',
  styleUrl: './product.page.component.css'
})

export class ProductPageComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private cart = inject(CartService);
  private toast = inject(ToastService);

  product: any;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.getProduct(id).subscribe(p => this.product = p);
  }

  add() {
    if (this.product) {
      this.cart.add(this.product, 1);
      this.toast.show(`${this.product.name} wurde in den Warenkorb gelegt.`, 'success');
    }
  }
}
