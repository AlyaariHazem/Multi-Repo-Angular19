import { loadRemoteModule } from '@angular-architects/module-federation';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule,HeaderComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  productComponent: any;
  cartComponent: any;

  async ngOnInit() {
    const productModule = await loadRemoteModule({ //method by module-federation returns a promise
      type: 'module',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
      exposedModule: './Component',
    });
    this.productComponent = productModule.AppComponent; //initializing AppComponent

    const cartModule = await loadRemoteModule({ //method by module-federation returns a promise
      type: 'module',
      remoteEntry: 'http://localhost:4202/remoteEntry.js',
      exposedModule: './Component',
    });
    this.cartComponent = cartModule.AppComponent;
  }
}
