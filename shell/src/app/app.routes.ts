// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  {
    path: 'home',
    loadComponent: () =>
      import('./pages/cards-home/cards-home.component').then(m => m.CardsHomeComponent),
  },

  // Remote: PRODUCTS
  {
    path: 'products',
    loadComponent: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './Component',
      }).then(m => m.AppComponent),
  },

  // Remote: CART
 {
  path: 'cart',
  loadComponent: () =>
    loadRemoteModule({
      type: 'module',
      remoteEntry: 'http://localhost:4202/remoteEntry.js',
      exposedModule: './Component',
    }).then(m => m.AppComponent),
},

  { path: '**', redirectTo: 'home' },
];
