import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from '../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly base = '/api'; // via proxy.conf.json -> http://localhost:4300

  /** Alle Produkte holen */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products`).pipe(
      catchError(err => {
        console.error('getProducts failed', err);
        return throwError(() => err);
      })
    );
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
  // searchProducts(q: string): Observable<Product[]> {
  //   return this.http.get<Product[]>(`${this.base}/products`, { params: { q } });
  // }
  //
  // createOrder(payload: { items: { productId: string; qty: number }[]; total: number; }): Observable<{ id: string }> {
  //   return this.http.post<{ id: string }>(`${this.base}/orders`, payload);
  // }
}