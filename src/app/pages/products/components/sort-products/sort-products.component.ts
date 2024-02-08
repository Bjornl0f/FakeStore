import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';

@Component({
  selector: 'app-sort-products',
  templateUrl: './sort-products.component.html',
  styleUrls: ['./sort-products.component.css']
})
export class SortProductsComponent implements OnChanges {
  isDropdownOpen: boolean = false;
  selectedSorting: string = 'Sort By';
  selectedGroup: number = 0;
  categoryMap: { [key: string]: boolean } = {};
  
  @Input() numberOfElements: number = 0;
  
  @Output() selectedSortingChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedGroupChange = new EventEmitter<number>();
  @Output() categoryMapChange: EventEmitter<{ [key: string]: boolean }> = new EventEmitter<{ [key: string]: boolean }>();
  @Output() checkedElementsChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() minPriceChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() maxPriceChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() minRangeChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() maxRangeChange: EventEmitter<number> = new EventEmitter<number>();
  
  isCategoryOpen: boolean = false;
  isPriceOpen: boolean = false;
  isFilterToggle: boolean = false;
  
  @Input() minRange: number = 0;
  @Input() maxRange: number = 1000;
  @Input() minPrice!: number;
  @Input() maxPrice!: number;
  
  checkedElements: string[] = [];
  checkedElementsAndPrice: any[] = [this.checkedElements, [this.minPrice, this.maxPrice]];

  @Output() checkedElementsAndPriceChange = new EventEmitter<any[]>();

  ngOnChanges(changes: SimpleChanges): void {
    if ('minPrice' in changes) {
      this.minPrice = changes['minPrice'].currentValue;
    }
    
    if ('maxPrice' in changes) {
      this.maxPrice = changes['maxPrice'].currentValue;
    }

    if ('minRange' in changes) {
      this.minRange = changes['minRange'].currentValue;
    }

    if ('maxRange' in changes) {
      this.maxRange = changes['maxRange'].currentValue;
    }

    this.updateSlider();
  }

  updateSlider() {
    const progressElement = document.querySelector('.progress') as HTMLElement;
    const inputMin = document.querySelector('.input-min') as HTMLInputElement;
    const inputMax = document.querySelector('.input-max') as HTMLInputElement;
  
    inputMin.value = Math.trunc(this.minPrice).toString();
    inputMax.value = Math.trunc(this.maxPrice).toString();

    if (this.maxPrice - 1 < this.minPrice) {
      let temp = Math.trunc(this.maxPrice) + 1;
      this.maxPrice = Math.trunc(this.minPrice) + 1;
      this.minPrice = temp - 1;
      inputMax.value = (Math.trunc(this.minPrice) + 1).toString();
    }

    if (this.maxPrice > this.maxRange || this.maxPrice === null) {
      this.maxPrice = Math.trunc(this.maxRange) + 1;
      inputMax.value = Math.trunc(this.maxRange).toString();
    }

    if (this.minPrice > this.maxRange) {
      this.minPrice = Math.trunc(this.maxRange);
      inputMin.value = Math.trunc(this.maxRange).toString();
    }

    if (this.minPrice < this.minRange || this.minPrice === null) {
      this.minPrice = Math.trunc(this.minRange);
      inputMin.value = Math.trunc(this.minRange).toString();
    }

    if (progressElement) {
      progressElement.style.left = `${(this.minPrice / this.maxRange) * 100}%`;
      progressElement.style.right = `${100 - (this.maxPrice / this.maxRange) * 100}%`;
    }

    this.checkedElementsAndPrice[1] = [this.minPrice, this.maxPrice];
    this.checkedElementsAndPriceChange.emit(this.checkedElementsAndPrice);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleCategory() {
    this.isCategoryOpen = !this.isCategoryOpen;
  }

  togglePrice() {
    this.isPriceOpen = !this.isPriceOpen;
    this.updateSlider();
  }

  selectSorting(sorting: string) {
    this.selectedSorting = sorting;
    this.isDropdownOpen = false;
    this.selectedSortingChange.emit(this.selectedSorting);
  }

  selectGrouping(group: number) {
    this.selectedGroup = group;
    this.selectedGroupChange.emit(this.selectedGroup);
  }

  toggleFilter() {
    this.isFilterToggle = !this.isFilterToggle;
  }

  toggleCheck(category: string) {
    this.categoryMap[category] = !this.categoryMap[category];
    this.updateCheckedElements(category);
    this.checkedElementsAndPrice[0] = [...this.checkedElements];
    this.checkedElementsAndPriceChange.emit(this.checkedElementsAndPrice);
  }

  isChecked(category: string): boolean {
    return this.categoryMap[category] || false;
  }

  updateCheckedElements(category: string) {
    const index = this.checkedElements.indexOf(category);

    if (this.categoryMap[category] && index === -1) {
      this.checkedElements.push(category);
    } else if (!this.categoryMap[category] && index !== -1) {
      this.checkedElements.splice(index, 1);
    }
  }

  displayCheckedElements(): string {
    const displayedArray = this.checkedElements.slice(0, 2).join(', ');
  
    return this.checkedElements.length > 2 ? displayedArray + ', ...' : displayedArray;
  }

  discardAll() {
    this.minPrice = this.minRange;
    this.maxPrice = this.maxRange;
    this.updateSlider();
    this.categoryMap = {};
    this.checkedElements = [];
    this.checkedElementsAndPrice = [[...this.checkedElements], [this.minPrice, this.maxPrice]];
    this.checkedElementsAndPriceChange.emit(this.checkedElementsAndPrice);
  }

  onCategoryMapChange(newCategoryMap: { [key: string]: boolean }) {
    this.categoryMap = { ...newCategoryMap }; 
  }

  onCheckedElementsChange(newCheckedElements: string[]) {
    this.checkedElements = [...newCheckedElements];
  }

  onMinPriceChange(newMinPrice: number) {
    this.minPrice = newMinPrice;
  }

  onMaxPriceChange(newMaxPrice: number) {
    this.maxPrice = newMaxPrice;
  }

  onMinRangeChange(newMinRange: number) {
    this.minRange = newMinRange;
  }

  onMaxRangeChange(newMaxRange: number) {
    this.maxRange = newMaxRange;
  }

  onCheckedElementsAndPriceChange(newCheckedElementsAndPrice: any[]) {
    this.checkedElementsAndPrice = newCheckedElementsAndPrice;
    this.checkedElementsAndPriceChange.emit(this.checkedElementsAndPrice);
  }

  updateFilters() {
    this.categoryMapChange.emit(this.categoryMap);
    this.checkedElementsChange.emit(this.checkedElements);
    this.minPriceChange.emit(this.minPrice);
    this.maxPriceChange.emit(this.maxPrice);
    this.minRangeChange.emit(this.minRange);
    this.maxRangeChange.emit(this.maxRange);
    this.updateSlider();
  }
}
