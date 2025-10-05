import { Component, inject, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { PricePipe } from '../../../shared/pipes/price.pipes';

@Component({
  selector: 'app-checkout.page',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, PricePipe],
  templateUrl: './checkout.page.component.html',
  styleUrl: './checkout.page.component.css'
})
export class CheckoutPageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  cart = inject(CartService);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    payment: ['card', Validators.required]
  });

  hasItems = computed(() => this.cart.items().length > 0);

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
}
