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

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    LoginSignupComponent,
    HomeComponent,
    AppFooterComponent,
    UserSignupComponent
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
