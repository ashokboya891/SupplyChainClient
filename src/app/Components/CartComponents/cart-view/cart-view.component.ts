import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/Service/orders.service';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.css']
})
export class CartViewComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  userId: string | null = null;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId');
    if (this.userId) {
      this.fetchCartItems();
    }
  }

  fetchCartItems() {
    this.ordersService.getCartItems(this.userId!).subscribe(
      (data: any[]) => {
        this.cartItems = data;
        this.calculateTotalPrice();
      },
      (error) => console.error('Error fetching cart items:', error)
    );
  }

  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
  updateQuantity(item: any, action: string) {
    if (action === 'increase') {
      item.quantity++;
    } else if (action === 'decrease' && item.quantity > 1) {
      item.quantity--;
    } else {
      return; // prevent decreasing below 1
    }
  
    this.calculateTotalPrice(); // Update UI immediately
  
    // Now sync to backend
    if (this.userId) {
      this.ordersService.updateCartItem(this.userId, item.productId, item.quantity).subscribe(
        () => {},
        (error) => console.error('Error updating quantity:', error)
      );
    }
  }
  
  // updateQuantity(item: any, action: string) {
  //   const updatedQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;

  //   if (updatedQuantity < 1) return;

  //   this.ordersService.updateCartItem(this.userId!, item.productId, updatedQuantity).subscribe(
  //     () => {
  //       item.quantity = updatedQuantity; // Update UI
  //       this.calculateTotalPrice();      // Recalculate
  //     },
  //     (error) => console.error('Error updating quantity:', error)
  //   );
  // }

  removeFromCart(itemId: string) {
    this.ordersService.removeFromCart(this.userId!, itemId).subscribe(
      () => {
        this.cartItems = this.cartItems.filter(item => item.productId !== itemId);
        this.calculateTotalPrice();
      },
      (error) => console.error('Error removing item:', error)
    );
  }
}
