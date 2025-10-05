import { Route } from '@angular/router';
import { cartRoutes } from './remote-routes/cart.routes';

export const ShellRemoteRoutes: Route[] = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/cards-home/cards-home.component').then(m => m.CardsHomeComponent),
  },
  {
    path: 'cart',
    data: { breadcrumb: 'cart' },
    children: [
      {
        path: '',
        children: [...cartRoutes],
      },
    ],
  },
  {
    path: 'products',
    data: { breadcrumb: 'products' },
    loadChildren: () =>
      import('./remote-routes/product.routes').then(m => m.productsRoutes),
  }
];
