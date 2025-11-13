import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, NgIf, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  c = inject(CartService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);


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

  constructor() {
   // aktuellen q-Wert aus der URL ins Eingabefeld übernehmen
   const q = this.route.snapshot.queryParamMap.get('q');
   if (q) this.query = q;
  }



  onSubmit() {
    const q = this.query?.trim();
    if (q) this.search.emit(q);

    // per URL navigieren (teilbar & reload-fest)
    this.router.navigate(['/shop'], { queryParams: q ? { q } : {} });

  }

  clear() {
    this.query = '';
    this.router.navigate(['/shop']); // Filter zurücksetzen
  }

  
}
