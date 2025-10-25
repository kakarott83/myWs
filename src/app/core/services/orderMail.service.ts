import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OrderMailService {
  constructor(private http: HttpClient) {}

  sendOrderConfirmation(order: any) {
    return this.http.post('/mail/send-order-confirmation', order); // dank Proxy
  }
}