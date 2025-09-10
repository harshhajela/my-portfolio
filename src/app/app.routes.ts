import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'project/:id',
    loadComponent: () => import('./components/project-details/project-details.component').then(m => m.ProjectDetailsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];