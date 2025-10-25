import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ApiService } from '../../core/services/api.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-landing.page',
  imports: [ProductItemComponent, NgIf, NgFor],
  templateUrl: './landing.page.component.html',
  styleUrl: './landing.page.component.css'
})
export class LandingPageComponent implements OnInit {
  private api = inject(ApiService);
  products = signal<any[]>([]);

  constructor() {
    this.api.getProducts().subscribe({
      next: res => this.products.set(res),
      error: err => console.error('getProducts error', err)
    });
  }


  ngOnInit(): void {
    console.log('OnInit')
  }
}
