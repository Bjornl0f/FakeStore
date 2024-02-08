import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartModalComponent } from '../cart-modal/cart-modal.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isBurgerMenuOpen: boolean = false;
  isCartOpen: boolean = false;
  searchTerm: string = '';
  @Input() numberOfItems: number = 0;
  @Input() listOfItems: any[] = [];

  @Output() listOfItemsChange = new EventEmitter<any[]>();
  @Output() productsChange: EventEmitter<Product[]> = new EventEmitter<Product[]>();
  products: Product[] = [];
  
  get circleVisible(): boolean {
    return Boolean(this.numberOfItems);
  }

  toggleBurgerMenu() {
    this.isBurgerMenuOpen = !this.isBurgerMenuOpen;
  }

  toggleCartModal() {
    this.isCartOpen = !this.isCartOpen;
  }

  onListOfItemsChange(newListOfItems: any[]) {
    this.listOfItems = newListOfItems;
    this.listOfItemsChange.emit(this.listOfItems);
  }

  onProductsChange(newProducts: Product[]) {
    this.products = newProducts;
  }

  filterProducts() {
    const searchTermLowerCase = this.searchTerm.toLowerCase();
    this.productsChange.emit(this.products.filter(product => product.title.toLowerCase().includes(searchTermLowerCase)));
  }  
}
