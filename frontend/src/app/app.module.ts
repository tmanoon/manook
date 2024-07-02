import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './root-cmp/app.component';
import { AppHeaderComponent } from './cmps/app-header/app-header.component';
import { LoginSignupComponent } from './cmps/login-signup/login-signup.component';
import { HomeComponent } from './pages/home/home.component';
import { AppFooterComponent } from './cmps/app-footer/app-footer.component';
import { UserSignupComponent } from './pages/user-signup/user-signup.component';
import { ClothingItemDetailsComponent } from './pages/clothing-item-details/clothing-item-details.component';
import { ClothingItemIndexComponent } from './pages/clothing-item-index/clothing-item-index.component';
import { HomeClothingItemPreviewComponent } from './cmps/home-clothing-item-preview/home-clothing-item-preview.component';
import { ClothingItemListComponent } from './cmps/clothing-item-list/clothing-item-list.component';
import { ClothingItemPreviewComponent } from './cmps/clothing-item-preview/clothing-item-preview.component';
import { ClothingItemFilterComponent } from './cmps/clothing-item-filter/clothing-item-filter.component';
import { DynamicStyleInputComponent } from './cmps/dynamic-style-input/dynamic-style-input.component';
import { DisconnectedUserComponent } from './cmps/disconnected-user/disconnected-user.component';
import { OrderPaymentComponent } from './pages/order-payment/order-payment.component';
import { UserWishlistComponent } from './pages/user-wishlist/user-wishlist.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    LoginSignupComponent,
    HomeComponent,
    AppFooterComponent,
    UserSignupComponent,
    ClothingItemDetailsComponent,
    ClothingItemIndexComponent,
    HomeClothingItemPreviewComponent,
    ClothingItemListComponent,
    ClothingItemPreviewComponent,
    ClothingItemFilterComponent,
    DynamicStyleInputComponent,
    DisconnectedUserComponent,
    OrderPaymentComponent,
    UserWishlistComponent,
    UserDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
