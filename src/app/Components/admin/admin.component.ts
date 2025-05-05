import { Component } from '@angular/core';
import { Product } from 'src/app/Models/Products';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  loading = true;
  products: Product[] = [];
  ordersService: any;
  
  ngOnInit(): void {
    this.ordersService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
