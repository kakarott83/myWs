import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type OrderItem = { id: string; name: string; qty: number; price: number };
export type OrderPayload = {
  customer: {
    firstName: string; lastName: string; email: string;
    address?: string; zip?: string; city?: string; payment?: string;
  };
  items: OrderItem[];
  totals: { subtotal: number; shipping: number; total: number };
};

@Injectable({ providedIn: 'root' })
export class OrderMailService {
  constructor(private http: HttpClient) {}

  sendOrderConfirmation(order: any) {
    console.log(order,'orderMailservice')
    return this.http.post('/api/mail/send-order-confirmation', order); // dank Proxy
  }
}