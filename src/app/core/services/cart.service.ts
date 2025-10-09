import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSig = signal<{[id: string]: {product: Product; qty: number}}>({});

  readonly items = computed(() => Object.values(this.itemsSig()));
  readonly subtotal = computed(() => this.items().reduce((s,i)=> s + i.product.price * i.qty, 0));
  readonly shipping = computed(() => (this.subtotal() > 5000 ? 0 : 499));
  readonly total = computed(() => this.subtotal() + this.shipping());
  readonly count = computed(() => this.items().reduce((n,i)=> n + i.qty, 0)); // 👈 NEU
  readonly displayCount = computed(() => {
    const c = this.count();
    return c > 9 ? '9+' : String(c);
  });

  add(p: Product, qty = 1) {
    const m = { ...this.itemsSig() };
    m[p.id] = { product: p, qty: (m[p.id]?.qty ?? 0) + qty };
    this.itemsSig.set(m);
  }
  update(id: string, qty: number) {
    const m = { ...this.itemsSig() };
    if (m[id]) m[id] = { ...m[id], qty };
    this.itemsSig.set(m);
  }
  remove(id: string) {
    const m = { ...this.itemsSig() };
    delete m[id];
    this.itemsSig.set(m);
  }
  clear() { this.itemsSig.set({}); }
}
