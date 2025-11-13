import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf, CurrencyPipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { PricePipe } from '../../../shared/pipes/price.pipes';
import { inject } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Product } from '../../../shared/models/product.model';

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
  loading = signal(false);
  product = signal<Product | null>(null);

  constructor(
    private supabase: SupabaseService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const idParam = params.get('id');
      if (!idParam) {
        console.log('Kein Produkt gefunden.');
        return;
      }

      await this.loadProduct(idParam);
    });
  }

  private async loadProduct(id: string) {
    this.loading.set(true);

    try {
      const p = await this.supabase.getProductById(id);
      this.product.set(p);
      console.log(this.product,'Product')
    } catch (err) {
      console.log('Produkt konnte nicht geladen werden.');
    } finally {
      console.log(false);
      this.loading.set(false);
    }
  }

  add() {
    const p = this.product()
    if (p) {
      this.cart.add(p, 1);
      this.toast.show(`${p.name} wurde in den Warenkorb gelegt.`, 'success');
    }
  }
}
