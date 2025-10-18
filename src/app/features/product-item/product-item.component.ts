import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})

export class ProductItemComponent {

  @Input() item!: Product;


  addToCart(item: Product) {
    console.log(item)
  }


}
