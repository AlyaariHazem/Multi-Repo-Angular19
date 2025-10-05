import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title = 'cart';
  cartItems: any = [];
  itemAvailable = false; //to know whether cart is empty or not

  //call back function for AddEventListener window method
  handleAddToCart = (event: any) => {
    // console.log('event', event.detail);
    let id = event.detail.id;
    let quantity = event.detail.quantity;
    const index = this.cartItems.findIndex(
      (item: any) => item.id === event.detail.id
    );

    if (index !== -1) {
      //if cart array is empty
      this.cartItems[index].quantity += 1;
    } else {
      event.detail.quantity = 1;
      this.cartItems.push(event.detail); // Add
    }
    // console.log('cartItem', this.cartItems);
    this.itemAvailable = true;
  };

  //on Component initialization- to load the cart
  ngOnInit() {
    window.addEventListener('add-to-cart', this.handleAddToCart);
  }

  ngOnDestroy() {
    window.removeEventListener('add-to-cart', this.handleAddToCart);
  }

  //to remove the product from the cart
  removeItem(index: any) {
    this.cartItems.splice(index, 1);
  }

 }

