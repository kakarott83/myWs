import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { CartService } from '../../core/services/cart.service';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  c = inject(CartService);


  /** Shop-/Seitenname in der Mitte */
  @Input() brand = 'DesertStore';

  /** Pfad/URL zum Logo (optional) */
  @Input() logoSrc = '/assets/logo.svg';
  /** RouterLink für Klick auf Logo/Brand */
  @Input() homeLink: any[] | string = '/';

  /** Zähler (optional) */
  @Input() favCount = 0;
  @Input() cartCount = 0;

  /** Suche */
  query = '';
  @Output() search = new EventEmitter<string>();

  onSubmit() {
    const q = this.query?.trim();
    if (q) this.search.emit(q);
  }
}
