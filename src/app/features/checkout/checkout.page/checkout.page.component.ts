import { Component, inject, computed, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { PricePipe } from '../../../shared/pipes/price.pipes';
import { OrderMailService } from '../../../core/services/orderMail.service';

@Component({
  selector: 'app-checkout.page',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, PricePipe],
  templateUrl: './checkout.page.component.html',
  styleUrl: './checkout.page.component.css'
})
export class CheckoutPageComponent implements OnInit {
  selectedPayment: string | null = null;
  isSubmitting = false;
  items:any = [];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  cart = inject(CartService);

  constructor(private orderMail: OrderMailService) {}

  ngOnInit(): void {
    console.log(this.cart.items())
    this.items = this.cart.items()
    console.log(this.items)
    
  }

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    zip: ['', Validators.required],
    city: ['', Validators.required],
    payment: ['card', Validators.required]
  });

  hasItems = computed(() => this.cart.items().length > 0);

    // Beispiel-Daten (ersetzt du mit deinen echten)
    order = {
      orderId: 'A-2025-0001',
      email: this.form.get('email')?.value,
      firstName: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      address: this.form.get('address')?.value,
      zip: this.form.get('zip')?.value,
      city: this.form.get('city')?.value,
      items: [
        { name: 'Hoodie Grau', qty: 1, price: 49.99 },
        { name: 'Cap Navy', qty: 1, price: 24.99 },
      ],
      subtotal: 74.98,
      shipping: 4.99,
      total: 79.97,
    };

  invalid(name: string) {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  submit() {
    if (this.form.invalid) return;
    // Hier würdest du später eine Order erzeugen + Stripe Session anfragen
    alert('Danke! Bestellung erstellt (Demo).');
    this.cart.clear();
    this.router.navigateByUrl('/'); // zurück zum Shop / Danke-Seite etc.
  }

  addPayment() {
    if (this.selectedPayment === 'paypal') {
      // TODO: PayPal-Flow
    } else if (this.selectedPayment === 'klarna') {
      // TODO: Klarna-Flow
    }
  }

  onCheckout() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;



    this.orderMail.sendOrderConfirmation(this.order).subscribe({
      next: (res) => {
        console.log('✅ Mail gesendet:', res);
        alert('Bestellbestätigung gesendet!');
      },
      error: (err) => {
        console.error('❌ Fehler beim Mailversand', err);
        alert('E-Mail-Versand fehlgeschlagen.');
      },
      complete: () => (this.isSubmitting = false),
    });
  }

  setOrder() {
    this.order = {
      orderId: 'A-2025-0001',
      email: this.form.get('email')?.value,
      firstName: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      address: this.form.get('address')?.value,
      zip: this.form.get('zip')?.value,
      city: this.form.get('city')?.value,
      /*items: [
        { name: 'Hoodie Grau', qty: 1, price: 49.99 },
        { name: 'Cap Navy', qty: 1, price: 24.99 },
      ],*/
      items: this.items,
      subtotal: 74.98,
      shipping: 4.99,
      total: 79.97,
    };
  }



}
