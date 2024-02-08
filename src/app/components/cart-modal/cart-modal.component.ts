import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css']
})
export class CartModalComponent {
  constructor(private cartService: CartService) {
    this.listOfItems = this.cartService.listOfItems;
  }
  
  totalPrice: number = 200;

  ngOnInit() {
    this.totalPriceCalc();
  }

  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Input() circleVisible: boolean = false;

  @Input() listOfItems: any[] = [];
  @Output() listOfItemsChange = new EventEmitter<any[]>();

  closeCartModal() {
    this.closeModal.emit();
  }

  notClosed(event: Event) {
   event.stopPropagation();
  }

  totalPriceCalc() {
    let sum = 0;
    for (let i = 0; i < this.listOfItems.length; i++) {
      sum += this.listOfItems[i][0].price * this.listOfItems[i][1];
    }
    this.totalPrice = parseFloat(sum.toString().slice(0, (sum.toString().indexOf('.')) + 3));
  }

  decrement(id: number) {
    for (let i = 0; i < this.listOfItems.length; i++) {
      if (this.listOfItems[i][0].id === id) {
        this.listOfItems[i][1] -= 1;
        this.listOfItemsChange.emit(this.listOfItems);
        this.totalPriceCalc();
        this.cartService.listOfItems = this.listOfItems;
        this.cartService.saveItemsToStorage();
        break;
      }
    }
  }

  increment(id: number) {
    for (let i = 0; i < this.listOfItems.length; i++) {
      if (this.listOfItems[i][0].id === id) {
        this.listOfItems[i][1] += 1;
        this.listOfItemsChange.emit(this.listOfItems);
        this.totalPriceCalc();
        this.cartService.listOfItems = this.listOfItems;
        this.cartService.saveItemsToStorage();
        break;
      }
    }
  }

  deleteItem(id: number) {
    for (let i = 0; i < this.listOfItems.length; i++) {
      if (this.listOfItems[i][0].id === id) {
        this.listOfItems.splice(i, 1);
        this.listOfItemsChange.emit(this.listOfItems);
        this.totalPriceCalc();
        this.cartService.listOfItems = this.listOfItems;
        this.cartService.saveItemsToStorage();
        break;
      }
    }
  }
}
