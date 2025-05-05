import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/Models/Products';
import { OrdersService } from 'src/app/Service/orders.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  products: Product[] = [];

  constructor(private ordersService: OrdersService, private router: Router) { }

  ngOnInit(): void {
    // Fetch products (or featured products)
    this.ordersService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    }, (error) => {
      console.log('Error fetching products:', error);
    });
  }

  // Navigate to the shop page
  goToShop(): void {
    this.router.navigate(['/shop']);
  }
}
