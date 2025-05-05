import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/Models/Products';

@Component({
  selector: 'app-product-quantity-dialog',
  templateUrl: './product-quantity-dialog.component.html',
  styleUrls: ['./product-quantity-dialog.component.css']
})
export class ProductQuantityDialogComponent implements OnInit {

  @Input() product!: Product;
  @Output() onAdd = new EventEmitter<{product: Product, quantity: number}>();
  @Output() onClose = new EventEmitter<void>();
  
  quantity: number = 1;
  display: boolean = true; // Controls dialog visibility

  addToCart() {
    if (this.quantity > 0) {
      this.onAdd.emit({
        product: this.product,
        quantity: this.quantity
      });
      this.close();
    }
  }

  close() {
    this.onClose.emit();
  }

  ngOnInit(): void {
    console.log('ProductQuantityDialogComponent initialized recived product is',this.product);  
    // Initialize any necessary data or state here
  }
}
