import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { AboutComponent } from './pages/about/about.component';
import { CartComponent } from './pages/cart/cart.component';

const routes: Routes = [{
  path: 'home',
  component: HomeComponent
},
{
  path: '', redirectTo: 'home', pathMatch: 'full'
},
{
  path: 'products',
  component: ProductsComponent
},
{
  path: 'about',
  component: AboutComponent
},
{
  path: 'cart',
  component: CartComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
