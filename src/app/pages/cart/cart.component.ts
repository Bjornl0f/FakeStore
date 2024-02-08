import { Component, HostListener } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  listOfItems: any[] = [];
  totalPrice: number = 200;
  shipmentPrice: number = 20;
  form: FormGroup;

  ngOnInit() {
    this.totalPriceCalc();
    this.calcNumberOfItems()
  }

  constructor(private cartService: CartService, private formBuilder: FormBuilder) {
    this.listOfItems = this.cartService.listOfItems;
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9+]*')]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
      cardHolderName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      cardNumber: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      expiryDate: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    });
  }

  totalPriceCalc() {
    let sum = 0;
    for (let i = 0; i < this.listOfItems.length; i++) {
      sum += this.listOfItems[i][0].price * this.listOfItems[i][1];
    }
    this.totalPrice = parseFloat(sum.toString().slice(0, (sum.toString().indexOf('.')) + 3));
  }

  calcNumberOfItems() {
    let sum = 0;
    for (let i = 0; i < this.listOfItems.length; i++) {
      sum += this.listOfItems[i][1];
    }
  }

  decrement(id: number) {
    for (let i = 0; i < this.listOfItems.length; i++) {
      if (this.listOfItems[i][0].id === id) {
        this.listOfItems[i][1] -= 1;
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
        this.totalPriceCalc();
        this.cartService.listOfItems = this.listOfItems;
        this.cartService.saveItemsToStorage();
        if (this.cartService.listOfItems.length === 0) {
          window.location.href = '/products';
        }
        break;
      }
    }
  }

  validateForm() {
    if (this.form.valid) {
      this.cartService.listOfItems = [];
      this.cartService.saveItemsToStorage();
      window.location.href = '/products';
    } else {
      // Mark invalid fields
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        if (control!.invalid) {
          // Add invalid-input class to corresponding input element
          const inputElement = document.querySelector(`input[formControlName="${field}"]`);
          if (inputElement) {
            inputElement.classList.add('invalid-input');
          }
        }
      });
    }
  }

  @HostListener('input', ['$event.target'])
  onInput(target: HTMLInputElement) {
    if (target.classList.contains('invalid-input') && target.value.trim()) {
      target.classList.remove('invalid-input');
    }
  }
}
