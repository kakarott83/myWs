import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { PricePipe } from '../../../shared/pipes/price.pipes';

@Component({
  selector: 'app-catalog.page',
  standalone: true,
  imports: [RouterLink, NgFor, PricePipe, NgIf],
  templateUrl: './catalog.page.component.html',
  styleUrl: './catalog.page.component.css'
})
export class CatalogPageComponent {
  private api = inject(ApiService);
  products = signal<any[]>([]);

  
  constructor() {
    this.api.getProducts().subscribe({
      next: res => this.products.set(res),
      error: err => console.error('getProducts error', err)
    });
  }

}
