import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { AboutComponent } from './pages/about/about.component';
import { CartModalComponent } from './components/cart-modal/cart-modal.component';
import { SortProductsComponent } from './pages/products/components/sort-products/sort-products.component';
import { FilterModalComponent } from './pages/products/components/filter-modal/filter-modal.component';
import { StoreService } from './services/store.service';
import { ProductBoxComponent } from './pages/products/components/product-box/product-box.component';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent } from './pages/cart/cart.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NavbarComponent,
        ProductsComponent,
        AboutComponent,
        CartModalComponent,
        SortProductsComponent,
        FilterModalComponent,
        ProductBoxComponent,
        CartComponent
    ],
    providers: [StoreService],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
    ]
})
export class AppModule { }
