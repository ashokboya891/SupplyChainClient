import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {  HTTP_INTERCEPTORS, HttpClient,HttpClientModule} from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/home/home.component';
import { AdminComponent } from './Components/admin/admin.component';
import { ShopComponent } from './Components/shop/shop.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { CartComponent } from './Components/CartComponents/cart-view/cart/cart.component';
import { CartViewComponent } from './Components/CartComponents/cart-view/cart-view.component';
import { CartCheckoutComponent } from './Components/CartComponents/cart-checkout/cart-checkout.component';
import { ProductQuantityDialogComponent } from './Components/product-quantity-dialog/product-quantity-dialog.component'; // path to your SharedModule file
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component'; // <-- Import this
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {  JwtInterceptor} from "src/app/Interceptors/jwt.interceptor";
import { NavbarComponent } from "src/app/shared/navbar/navbar.component";
import {  JwtModule} from "@auth0/angular-jwt";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AdminComponent,
    ShopComponent,
    CartComponent,
    CartViewComponent,
    CartCheckoutComponent,
    ProductQuantityDialogComponent,
    LoginComponent,
    RegisterComponent,
    
  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastModule,
JwtModule.forRoot({
  config: {
    tokenGetter: () => {
      return (sessionStorage.getItem("currentUser") 
        ? JSON.parse(sessionStorage.getItem("currentUser") as string).token 
        : null);
    }
  }
})

    
    
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
