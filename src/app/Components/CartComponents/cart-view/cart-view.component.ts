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
  //  userId?:string=sessionStorage.getItem('userId');

  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId');
    if (this.userId) {
      this.ordersService.getCartItems(this.userId).subscribe(
        (data: any[]) => {
          this.cartItems = data;
          this.calculateTotalPrice();
          console.log('Cart items:', this.cartItems);
        },
        (error) => {
          console.error('Error fetching cart items:', error);
        }
      );
    }
  }

  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
  updateQuantity(item: any, action: string) {
    // Modify quantity
    if (action === 'increase') {
      item.quantity++;
    } else if (action === 'decrease' && item.quantity > 1) {
      item.quantity--;
    }
  
    // Recalculate total immediately for UI
    this.calculateTotalPrice();
  
    // Persist update via API
    if (this.userId) {
      this.ordersService.updateCartItem(this.userId, item.productId, item.quantity).subscribe(
        () => {
          // Optionally re-fetch data here, or just leave it since UI is already updated
        },
        (error: any) => console.error('Error updating quantity:', error)
      );
    }
  }
  
  // updateQuantity(item: any, action: string) {
  //   // Update quantity based on the action
  //   if (action === 'increase') {
  //     item.quantity++;
  //   } else if (action === 'decrease' && item.quantity > 1) {
  //     item.quantity--;
  //   }

  //   // Call the service to update the cart item quantity
  //   if (this.userId) {
  //     this.ordersService.updateCartItem(this.userId, item.productId, item.quantity).subscribe(
  //       () => {
  //         this.calculateTotalPrice();
  //       },
  //       (error: any) => console.error('Error updating quantity:', error)
  //     );
  //   }
  // }

  // Optionally, you can implement removeFromCart to handle removing items from the cart
  removeFromCart(itemId: string) {
    this.ordersService.removeFromCart(this.userId!, itemId).subscribe(
      () => {
        this.cartItems = this.cartItems.filter(item => item.productId !== itemId);
        this.calculateTotalPrice();
      },
      (error: any) => console.error('Error removing item:', error)
    );
  }
}
