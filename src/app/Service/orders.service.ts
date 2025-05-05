import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Product } from '../Models/Products';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  products: Product[] = [];
  //https://localhost:7092/api/Customers/GetProducts
  apiUrl: string = 'https://localhost:7092/api/Customers/GetProducts';
  constructor(private http:HttpClient,private route:Router) { }
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
  
  addToCart(product: Product) {
    this.http.post('https://localhost:7092/api/Customers/AddToCart', product).subscribe(
      (response) => {
        console.log('Product added to cart:', response);
        // Optionally, navigate to the cart page or show a success message
        this.route.navigate(['/cart']);
      },
      (error) => {
        console.error('Error adding product to cart:', error);
        // Optionally, show an error message to the user
      } 
    );
  }


  
}
