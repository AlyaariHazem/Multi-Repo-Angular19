import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GroceriesService } from './services/groceries.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  products:any = [];
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
