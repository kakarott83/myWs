import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductItemComponent } from '../../product-item/product-item.component';
import { ApiService } from '../../../core/services/api.service';
import { NgFor, NgIf } from '@angular/common';
import type { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-catalog.page',
  standalone: true,
  imports: [ProductItemComponent, NgIf, NgFor],
  templateUrl: './catalog.page.component.html',
  styleUrl: './catalog.page.component.css'
})
export class CatalogPageComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  products = signal<Product[]>([]);
  category = signal<string | null>(null);
  slug = signal<string | null>(null);


  constructor() {
    this.api.getProducts().subscribe({
      next: res => this.products.set(res),
      error: err => console.error('getProducts error', err)
    });

    const route = inject(ActivatedRoute);
    route.paramMap.subscribe(pm => this.slug.set((pm.get('slug') ?? '').toLowerCase()));
    console.log('catalog')

  }

  filteredProducts = computed(() => {
    const list = this.products();
    const cat = this.slug();
    console.log(cat, 'Cat')
    if(!cat) {
      return list
    }
    return list.filter(p =>
      (!cat || (p.category ?? '').toLowerCase() === cat) 
    );
  });

}
