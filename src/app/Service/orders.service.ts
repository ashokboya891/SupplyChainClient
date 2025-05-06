import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Product } from '../Models/Products';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  // Your API URLs
  apiUrl: string = 'https://localhost:7092/api/Customers/GetProducts';
  cartApiUrl: string = 'https://localhost:7092/api/Cart'; // Assuming the same endpoint for cart operations
  
  constructor(private http: HttpClient, private route: Router) {}

  // Fetch products from API
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        if (error.status === 0) {
          console.error('Network error or CORS issue.');
        } else {
          console.error(`HTTP error status: ${error.status}`);
        }
        return of([]);  // Return an empty array in case of error
      })
    );
  }

  // Add product to cart or update quantity if already exists
  addToCart(product: Product, quantity: number) {
    const userId = sessionStorage.getItem('userId');
    const cartItem = {
      userId: userId,
      productId: product.productID?.toString(),
      productName: product.productName,
      price: product.unitPrice,
      quantity: quantity
    };

    // First check if the product already exists in the cart
    this.getCartItems(userId!).subscribe(cartItems => {
      const existingItem = cartItems.find(item => item.productId === cartItem.productId);

      if (existingItem) {
        // If item exists, update the quantity
        this.updateCartItem(userId!, existingItem.productId, existingItem.quantity + quantity).subscribe(
          response => {
            console.log('Cart updated:', response);
            this.route.navigate(['/cart']);
          },
          error => {
            console.error('Error updating cart:', error);
          }
        );
      } else {
        // If item doesn't exist, add to cart
        this.http.post(this.cartApiUrl, cartItem).subscribe(
          response => {
            console.log('Product added to cart:', response);
            this.route.navigate(['/cart']);
          },
          error => {
            console.error('Error adding product to cart:', error);
          }
        );
      }
    });
  }

  // Get cart items for the user
  getCartItems(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.cartApiUrl}/${userId}`);
  }

  // Update cart item quantity
  updateCartItem(userId: string, productId: string, quantity: number): Observable<any> {
    // Use PUT method to update cart item quantity
    return this.http.put(`${this.cartApiUrl}/${userId}/${productId}`, quantity);
  }
  removeFromCart(userId: string, productId: string): Observable<any> {
    // Use DELETE method to remove cart item
    return this.http.delete(`${this.cartApiUrl}/${userId}/${productId}`);
  }

}
