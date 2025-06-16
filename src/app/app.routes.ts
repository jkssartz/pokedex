import { Routes } from '@angular/router';
import { Tab1Page } from './tab1/tab1.page';
import { Tab2Page } from './tab2/tab2.page';
import { Tab3Page } from './tab3/tab3.page';

export const routes: Routes = [
  {
    path: '',
    component: Tab1Page
  },
  {
    path: 'tabs/tab1',
    component: Tab1Page
  },
  {
    path: 'tabs/tab2',
    component: Tab2Page
  },
  {
    path: 'tabs/tab3',
    component: Tab3Page
  },
  {
    path: 'tabs/detalhes/:id',
    loadComponent: () => import('./tabs/detalhes/detalhes.page').then(m => m.DetalhesPage)
  }
];
