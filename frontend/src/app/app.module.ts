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
    ClothingItemListComponent
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
