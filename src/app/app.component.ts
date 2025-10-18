import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './shared/ui/toast-container.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CartService } from './core/services/cart.service';
import { inject } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {
  readonly year = new Date().getFullYear();
  cart = inject(CartService);
}
