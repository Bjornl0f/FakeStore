import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.css']
})
export class FilterModalComponent implements OnChanges {
  isCategoryOpen: boolean = false;
  isPriceOpen: boolean = false;
  @Input() categoryMap: { [key: string]: boolean } = {};
  @Output() categoryMapChange = new EventEmitter<{ [key: string]: boolean }>();
  @Output() checkedElementsChange = new EventEmitter<string[]>();
  isModalOpen: boolean = true;
  isModalOpenFR: boolean = true;

  @Input() numberOfElements: number = 0;

  @Output() closedModal: EventEmitter<void> = new EventEmitter();
  @Output() updateFiltersEvent: EventEmitter<void> = new EventEmitter<void>();

  @Input() minRange: number = 0;
  @Input() maxRange: number = 1000;
  @Input() minPrice!: number;
  @Input() maxPrice!: number;
  
  @Output() minPriceChange: EventEmitter<number> = new EventEmitter;
  @Output() maxPriceChange: EventEmitter<number> = new EventEmitter;
  @Output() minRangeChange: EventEmitter<number> = new EventEmitter;
  @Output() maxRangeChange: EventEmitter<number> = new EventEmitter;
  
  
  @Input() checkedElements: string[] = [];
  @Input() checkedElementsAndPrice: any[] = [this.checkedElements, [this.minPrice, this.maxPrice]];

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
  
    if (this.maxPrice - 1 < this.minPrice) {
      let temp = Math.trunc(this.maxPrice) + 1;
      this.maxPrice = Math.trunc(this.minPrice) + 1;
      this.minPrice = temp - 1;
      inputMax.value = (Math.trunc(this.minPrice) + 1).toString();
    }

    if (this.maxPrice > this.maxRange || this.maxPrice === null) {
      this.maxPrice = Math.trunc(this.maxRange) + 1;
      inputMax.value = (Math.trunc(this.maxRange) + 1).toString();
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

  

  toggleCategory() {
    this.isCategoryOpen = !this.isCategoryOpen;
  }

  togglePrice() {
    this.isPriceOpen = !this.isPriceOpen;
    this.updateSlider();
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

  updateFilters() {
    this.categoryMapChange.emit(this.categoryMap);
    this.checkedElementsChange.emit(this.checkedElements);
    this.minPriceChange.emit(this.minPrice);
    this.maxPriceChange.emit(this.maxPrice);
    this.minRangeChange.emit(this.minRange);
    this.maxRangeChange.emit(this.maxRange);
    this.updateSlider();
    this.updateFiltersEvent.emit();
  }

  closeModal() {
    this.isModalOpen = false;
  }

  closeModalFR() {
    setTimeout(() => {
      this.isModalOpenFR = false;
    }, 700);
  }

  closeFilterModal() {
    setTimeout(() => {
      this.closedModal.emit();
    }, 500);
  }
}
