import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'loader',
    loadComponent: () => import('./loader/loader.page').then( m => m.LoaderPage)
  }
];
