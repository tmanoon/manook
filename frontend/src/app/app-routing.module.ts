import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserSignupComponent } from './pages/user-signup/user-signup.component';
import { ClothingItemIndexComponent } from './pages/clothing-item-index/clothing-item-index.component';


const routes: Routes = [
  {
    path: 'signup',
    component: UserSignupComponent
  },
  {
    path: 'clothing-item',
    component: ClothingItemIndexComponent
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
