import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  scrolled = false;
  // constructor(public cart: CartService) {}

  cart = inject(CartService);

  @HostListener('window:scroll', [])
  onScroll() {
    this.scrolled = window.scrollY > 12;
  }

}
