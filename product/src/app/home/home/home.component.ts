import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GroceriesService } from '../../services/groceries.service';
import { IProduct } from '../../shared/models/products.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private groceries = inject(GroceriesService);
  products: IProduct[] = [];

  ngOnInit(): void {
    this.groceries.getGroceries().subscribe({
      next: list => this.products = list,
      error: () => {
        // fallback if API blocked / offline
        this.products = [
          { id: 1, name: 'Apple',  price: 1.2, img: 'https://placehold.co/600x400' },
          { id: 2, name: 'Banana', price: 0.5, img: 'https://placehold.co/600x400/png' }
        ];
      }
    });
  }

  addToCart(product: IProduct) {
    const event = new CustomEvent('add-to-cart', { detail: product });
    window.dispatchEvent(event);
  }
}
