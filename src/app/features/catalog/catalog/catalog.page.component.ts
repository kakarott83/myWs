import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductItemComponent } from '../../product-item/product-item.component';
import { ApiService } from '../../../core/services/api.service';
import { NgFor, NgIf } from '@angular/common';
import type { Product } from '../../../shared/models/product.model';
import { combineLatest, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { SupabaseService } from '../../../core/services/supabase.service';

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
  slug     = signal<string | null>(null);   // Kategorie aus /shop/:slug
  loading  = signal<boolean>(true);
  error    = signal<string | null>(null);


  constructor(private supabase: SupabaseService) { }

  async ngOnInit() {
    // reagiert auch, wenn du zwischen /shop und /shop/armreif-liebe hin- und hernavigierst
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug'); // z.B. 'armreif-liebe'
      this.loadProducts(slug);
    });
  }

  private async loadProducts(slug: string | null) {
    this.loading.set(true);
    this.error.set(null);

    try {
      let data: Product[];
      if (slug) {
        data = await this.supabase.getProductsBySlug(slug);
      } else {
        data = await this.supabase.getProducts();
      }
      this.products.set(data);
    } catch (err) {
      this.error.set('Produkte konnten nicht geladen werden.');
    } finally {
      this.loading.set(false);
    }
  }

  async onSearch(query: string) {
    this.loading.set(true);
    this.error.set(null);

    try {
      if (!query || !query.trim()) {
        const data = await this.supabase.getProducts();
        this.products.set(data);
      } else {
        const data = await this.supabase.searchProducts(query.trim());
        this.products.set(data);
      }
    } catch (err) {
      this.error.set('Suche ist fehlgeschlagen.');
    } finally {
      this.loading.set(false);
    }
  }

  async onFilterCategory(category: string) {
    this.loading.set(true);
    this.error.set(null);

    try {
      if (!category) {
        const data = await this.supabase.getProducts();
        this.products.set(data);
      } else {
        const data = await this.supabase.getProductsByCategory(category);
        this.products.set(data);
      }
    } catch (err) {
      this.error.set('Filter konnte nicht geladen werden.');
    } finally {
      this.loading.set(false);
    }
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
