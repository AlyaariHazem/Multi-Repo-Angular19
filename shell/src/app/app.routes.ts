import { Routes } from '@angular/router';
import { ShellRemoteRoutes } from './shell-remote.routes';

export const routes: Routes = [
  {
    path: '',
    children: [...ShellRemoteRoutes],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/Login/login.component').then(m => m.LoginComponent),
  },
  { path: '**', redirectTo: 'login' },
];
