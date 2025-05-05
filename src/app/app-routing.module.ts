import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { AdminComponent } from './Components/admin/admin.component';
import { ShopComponent } from './Components/shop/shop.component';
import { CartComponent } from './Components/CartComponents/cart-view/cart/cart.component';
import { CartViewComponent } from './Components/CartComponents/cart-view/cart-view.component';
import { CartCheckoutComponent } from './Components/CartComponents/cart-checkout/cart-checkout.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import {  adminGuard} from "src/app/_guards/admin.guard";
import { userGuard } from './_guards/user.guard';

const routes: Routes = [
  // {
  //   path: 'home',component:HomeComponent
  // },

  // {
  //   path: 'shop',component:ShopComponent
  // },
  // {
  //   path:'cart',component:CartComponent
  // },
  // {
  //   path: 'cart/view',component:CartViewComponent
  // },
  // {
  //   path: 'cart/checkout', component:CartCheckoutComponent
  // },
  {
    path:'login',component:LoginComponent
  },
  {
    path:'register',component:RegisterComponent
  },
  {
    path: "", canActivate: [userGuard], data: { expectedRoles:["User","Admin"] }, children: [
      { path: "shop", component: ShopComponent, data: { linkIndex: 0 }},
      {
        path:'',component:HomeComponent
      },
      {
        path: 'shop',component:ShopComponent
      },
      {
        path:'cart',component:CartComponent
      },
      {
        path: 'cart/view',component:CartViewComponent
      },
      {
        path: 'cart/checkout', component:CartCheckoutComponent
      },
      {
        path: 'home', component:HomeComponent

      }
      ]
  },
  {
    path: "", canActivate: [adminGuard], data: { expectedRoles: "Admin" }, children: [
      { path: "admin-panel", component: AdminComponent, data: { linkIndex: 0 }},
      {
        path:'',component:HomeComponent
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
