import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  listOfItems: any[] = [];

  constructor() {
    this.loadItemsFromStorage();
  }

  private loadItemsFromStorage() {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      this.listOfItems = JSON.parse(storedItems);
    }
  }

  saveItemsToStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.listOfItems));
  }
}
