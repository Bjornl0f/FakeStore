// product-box.component.ts
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StoreService } from '../../../../services/store.service';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrls: ['./product-box.component.css']
})
export class ProductBoxComponent implements OnInit {
  @Output() productsChange: EventEmitter<Product[]> = new EventEmitter<Product[]>();
  products: Product[] = [];

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.storeService.getProducts().subscribe(
      (products: Product[]) => {
        this.products = products;
        this.productsChange.emit(this.products);
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }
}
