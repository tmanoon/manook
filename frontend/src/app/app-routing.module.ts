import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserSignupComponent } from './pages/user-signup/user-signup.component';
import { ClothingItemIndexComponent } from './pages/clothing-item-index/clothing-item-index.component';
import { ClothingItemDetailsComponent } from './pages/clothing-item-details/clothing-item-details.component';
import { clothingItemResolver } from './resolvers/clothing-item.resolver';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { UserWishlistComponent } from './pages/user-wishlist/user-wishlist.component';
import { UserOrderComponent } from './pages/user-order/user-order.component';


const routes: Routes = [
  {
    path: 'signup',
    component: UserSignupComponent
  },
  {
    path: 'wishlist',
    component: UserWishlistComponent,
  },
  {
    path: 'order',
    component: UserOrderComponent
  },
  {
    path: 'clothing-item',
    component: ClothingItemIndexComponent
  },
  {
    path: 'clothing-item/:id',
    component: ClothingItemDetailsComponent,
    resolve: { clothingItem : clothingItemResolver}
  },
  {
    path: '',
    component: HomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
