import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'modules', pathMatch: 'full' },
    {
      path: 'modules',
      loadChildren: () =>
        import('./home/home.module').then(m => m.HomeModule),
    },
];
