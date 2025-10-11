import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GroceriesService } from '../../services/groceries.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
   products:any = [
    { id: 1, name: 'Apple', price: 1.2, img: 'https://placehold.co/600x400' },
    { id: 2, name: 'Banana', price: 0.5, img: 'https://placehold.co/600x400/png' },
    { id: 3, name: 'Orange', price: 0.8, img: 'https://placehold.co/600x400/000000/FFFFFF/png' },
    { id: 4, name: 'Grapes', price: 2.0, img: 'https://placehold.co/600x400' },
    { id: 5, name: 'Mango', price: 1.5, img: 'https://placehold.co/600x400/png' }
   ];
     constructor(private groceries:GroceriesService){}

     //to initialize the products array on Component Initialization
     ngOnInit(): void {
      
     }

     //method to send the product details to the cart
     addToCart(product: any) {
       console.log("product:", product);
       const event = new CustomEvent('add-to-cart', { detail: product }); //creating a custom browser/window event to pass the data
       window.dispatchEvent(event); //to dispatch the data (in the form of event)
       console.log("add to cart called");

     }
 }

