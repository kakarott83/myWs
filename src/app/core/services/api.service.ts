import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from '../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly base = '/api'; // via proxy.conf.json -> http://localhost:4300

  /** Alle Produkte holen */
  /*getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products`).pipe(
      catchError(err => {
        console.error('getProducts failed', err);
        return throwError(() => err);
      })
    );
  }*/

  getProducts(opts?: { q?: string }): Observable<Product[]> {
    let params = new HttpParams();
    if (opts?.q) {
      // unscharf über unser Sammelfeld "search"
      const q = opts.q.trim().toLowerCase();
      // optional: mehrere Wörter tolerant machen (z. B. "hoodie grau" → "hoodie.*grau")
      const pattern = q.replace(/\s+/g, '.*');
      params = params.set('search_like', pattern);
    }
    return this.http.get<Product[]>(`${this.base}/products`, { params });
  }



  /** Einzelnes Produkt holen */
  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/products/${id}`).pipe(
      catchError(err => {
        console.error('getProduct failed', err);
        return throwError(() => err);
      })
    );
  }

  // ---- Beispiele für spätere Erweiterungen ----
  /*searchProducts(q: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products`, { params: { q } });
  }*/
  //
  // createOrder(payload: { items: { productId: string; qty: number }[]; total: number; }): Observable<{ id: string }> {
  //   return this.http.post<{ id: string }>(`${this.base}/orders`, payload);
  // }
}