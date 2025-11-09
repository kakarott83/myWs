import { Component, inject, computed, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { PricePipe } from '../../../shared/pipes/price.pipes';
import { OrderMailService, OrderPayload } from '../../../core/services/orderMail.service';
import { ToastService } from '../../../core/services/toast.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout.page',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, PricePipe, RouterLink],
  templateUrl: './checkout.page.component.html',
  styleUrl: './checkout.page.component.css'
})
export class CheckoutPageComponent {
  private fb = inject(FormBuilder);
  private cart = inject(CartService);
  private ordermail = inject(OrderMailService);
  private toast = inject(ToastService);

  pending = false;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: [''],
    zip: [''],
    city: [''],
    payment: ['PayPal', Validators.required]
  });

  get items() {
    // [{ product: Product, qty: number }]  ->  [{id,name,qty,price}]
    return this.cart.items().map((ci: { product: any; qty: number }) => ({
      id: ci.product.id,
      name: ci.product.name,
      qty: ci.qty,
      price: ci.product.price
    }));
  }

  get totals() {
    // Falls dein CartService nur total() hat:
    const subtotal = this.cart.total();   // Summe der Positionen
    const shipping = 0;                   // ggf. dynamisch setzen
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }

  hasItems(): boolean {
  const items = this.cart.items();
  return Array.isArray(items) && items.length > 0;
  }

  invalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  async submit() {
    if (this.pending) return;


    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Bitte Formular vervollständigen.', 'warning');
      return;
    }

    this.pending = true;

    const payload: OrderPayload = {
      customer: {
        firstName: this.form.value.firstName!,
        lastName:  this.form.value.lastName!,
        email:     this.form.value.email!,
        address:   this.form.value.address || '',
        zip:       this.form.value.zip || '',
        city:      this.form.value.city || '',
        payment:   this.form.value.payment || ''
      },
      items: this.items.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
      totals: this.totals
    };

    this.ordermail.sendOrderConfirmation(payload).subscribe({
      next: () => {
        this.toast.show('Bestellbestätigung per E-Mail versendet.', 'success');
        //this.cart.clear();
      },
      error: () => this.toast.show('E-Mail Versand fehlgeschlagen.', 'danger'),
      complete: () => (this.pending = false)
    });
  }
}
