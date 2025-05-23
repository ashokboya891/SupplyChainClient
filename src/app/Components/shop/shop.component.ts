import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/Models/Products';
import { OrdersService } from 'src/app/Service/orders.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent  implements OnInit {

  products: Product[] = [];
  loading: boolean = true;  // Loading indicator for UI

  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.ordersService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        this.loading = false; // Data loaded, hide loading indicator
        console.log('Products:', this.products);
      },
      (error) => {
        this.loading = false;
        console.error('Error fetching products', error);
      }
    );
  }

  selectedProduct: Product | null = null;

  showAddToCartDialog(product: Product) {
    this.selectedProduct = product;
  }

  addToCart(event: {product: Product, quantity: number}) {
    this.ordersService.addToCart(event.product, event.quantity);
    console.log(`Adding ${event.quantity} of ${event.product.productName} to cart`);
    this.selectedProduct = null;
  }
  

  closeDialog() {
    this.selectedProduct = null;
  }
}


