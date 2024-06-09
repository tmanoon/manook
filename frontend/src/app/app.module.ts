import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './root-cmp/app.component';
import { AppHeaderComponent } from './cmps/app-header/app-header.component';
import { LoginSignupComponent } from './cmps/login-signup/login-signup.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    LoginSignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
