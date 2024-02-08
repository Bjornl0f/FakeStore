// products.component.ts
import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SortProductsComponent } from './components/sort-products/sort-products.component';
import { ProductBoxComponent } from './components/product-box/product-box.component';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  listOfItems: any[] = [];
  
  selectedGroup: number = 0;
  selectedSorting: string = 'Sort By';
  products: Product[] = [];
  staticProducts: Product[] = [];

  numberOfElements: number = 20;
  checkedElementsAndPrice: any[] = [[], []]
  
  categoryMap: { [key: string]: boolean } = {};
  checkedElements: string[] = [];
  minRange: number = 0;
  maxRange: number = 1000;
  minPrice: number = this.minRange;
  maxPrice: number = this.maxRange;

  numberOfItems: number = 0;
  
  constructor(private cartService: CartService) {
    this.listOfItems = this.cartService.listOfItems;
    this.staticProducts = this.cartService.listOfItems;
  }

  ngOnInit() {
    this.calcNumberOfItems();
  }

  @ViewChild(SortProductsComponent) sortProductsComponent!: SortProductsComponent;

  sortProductsAlphabetically() {
    this.products.sort((a, b) => a.title.localeCompare(b.title));
  }

  sortProductsByPopularity() {
    this.products.sort((a, b) => b.rating.rate - a.rating.rate)
  }

  sortProductsByPriceAscending() {
    this.products.sort((a, b) => a.price - b.price);
  }

  sortProductsByPriceDescending() {
    this.products.sort((a, b) => b.price - a.price);
  }

  filterProductsByName(name: string) {
    this.products = this.products.filter((product) => {
      return product.title.includes(name);
    })
  }

  onSelectedSortingChange(newSelectedSorting: string) {
    this.selectedSorting = newSelectedSorting;
    
    switch (newSelectedSorting) {
      case 'Alphabetical':
        this.sortProductsAlphabetically();
        break;
      case 'Most Popular':
        this.sortProductsByPopularity();
        break;
      case 'Price: Low -- High':
        this.sortProductsByPriceAscending();
        break;
      case 'Price: High -- Low':
        this.sortProductsByPriceDescending();
        break;
      default:
        break;
    }
  }

  onSelectedGroupChange(newSelectedGroup: number) {
    this.selectedGroup = newSelectedGroup;
  }

  onProductsChange(newProducts: Product[]) {
    this.products = newProducts;
    this.staticProducts = newProducts;
    this.onSelectedSortingChange(this.selectedSorting);
    this.updatePriceRanges();
  }

  onCategoryMapChange(newCategoryMap: { [key: string]: boolean }) {
    this.categoryMap = { ...newCategoryMap }; 
    this.applyFilters();
  }

  onCheckedElementsChange(newCheckedElements: string[]) {
    this.checkedElements = [...newCheckedElements];
    this.applyFilters();
  }

  onMinPriceChange(newMinPrice: number) {
    this.minPrice = newMinPrice;
    this.applyFilters();
  }

  onMaxPriceChange(newMaxPrice: number) {
    this.maxPrice = newMaxPrice;
    this.applyFilters();
  }

  onMinRangeChange(newMinRange: number) {
    this.minRange = newMinRange;
    this.applyFilters();
  }

  onMaxRangeChange(newMaxRange: number) {
    this.maxRange = newMaxRange;
    this.applyFilters();
  }

  onNumberOfElementsChange(newNumberOfElements: number) {
    this.numberOfElements = newNumberOfElements;
  }

  onCheckedElementsAndPriceChange(newCheckedElementsAndPrice: any[]) {
    this.checkedElementsAndPrice = newCheckedElementsAndPrice;
    this.updateNumberOfElements();
  }

  onListOfItemsChange(newListOfItems: any[]) {
    this.listOfItems = newListOfItems;
    this.calcNumberOfItems();
    this.cartService.listOfItems = this.listOfItems;
    this.cartService.saveItemsToStorage()
  }

  applyFilters() {
    let filteredProducts = [...this.staticProducts];
    let filteredProductsWithMinRange = [];
    
    if (this.checkedElements.length === 0) {
      this.categoryMap = {
        'men\'s clothing': true, 'women\'s clothing': true, jewelery: true, electronics: true
      }
      this.checkedElements = ['men\'s clothing', 'women\'s clothing', 'jewelery', 'electronics'];
    }
  
    if (Object.keys(this.categoryMap).length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        return Object.keys(this.categoryMap).some(category => {
          return this.categoryMap[category] && product.category === category;
        });
      });
    }


    if (this.checkedElements.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        return this.checkedElements.includes(product.category);
      });
    }

    filteredProductsWithMinRange = [...filteredProducts];
  
    filteredProducts = filteredProducts.filter(product => {
      return product.price >= this.minPrice && product.price <= this.maxPrice;
    });

    if (Object.keys(filteredProducts).length) {
      this.products = filteredProducts;
    }
    else {
      this.minPrice = this.minRange;
      filteredProductsWithMinRange = filteredProductsWithMinRange.filter(product => {
        return product.price >= this.minPrice && product.price <= this.maxPrice;
      });
      this.products = filteredProductsWithMinRange;
    }

    this.updatePriceRanges();
  }
  
  updatePriceRanges() {
    let filteredProducts = [...this.staticProducts];

    if (Object.keys(this.categoryMap).length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        return Object.keys(this.categoryMap).some(category => {
          return this.categoryMap[category] && product.category === category;
        });
      });
    }
  
    if (this.checkedElements.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        return this.checkedElements.includes(product.category);
      });
    }

    const prices = filteredProducts.map(product => product.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    this.minRange = Math.trunc(minPrice);
    this.maxRange = Math.trunc(maxPrice) + 1;

    if (this.maxPrice > this.maxRange) {
      this.maxPrice = this.maxRange;
    }
  }

  updateNumberOfElements() {
    let filteredProducts = [...this.staticProducts];

    const min = this.checkedElementsAndPrice[1][0];
    const max = this.checkedElementsAndPrice[1][1];

    if (this.checkedElementsAndPrice[0].length === 0) {
      this.checkedElementsAndPrice[0] = ['men\'s clothing', 'women\'s clothing', 'jewelery', 'electronics'];
    }

    filteredProducts = filteredProducts.filter(product => {
      return this.checkedElementsAndPrice[0].includes(product.category) && product.price >= min && product.price <= max;
    })

    this.numberOfElements = Object.keys(filteredProducts).length;
  }

  addToCart(id: number) {
    const item = this.products.find(el => el.id === id);

    let amount = 1;

    for (let i = 0; i < this.listOfItems.length; i++) {
      if (item === this.listOfItems[i][0]) {
        this.listOfItems[i][1] += 1;
        amount = this.listOfItems[i][1];
      }
    }

    if (amount === 1) {
      this.listOfItems.push([item, amount]);
    }
    
    this.calcNumberOfItems();
    this.cartService.listOfItems = this.listOfItems;
    this.cartService.saveItemsToStorage()
  }

  calcNumberOfItems() {
    let sum = 0;
    for (let i = 0; i < this.listOfItems.length; i++) {
      sum += this.listOfItems[i][1];
    }
    this.numberOfItems = sum;
  }
}
