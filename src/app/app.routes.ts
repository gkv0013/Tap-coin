import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/collect', pathMatch: 'full' },
    { path: 'collect', loadComponent: () => import('./collect/collect.component').then(m => m.CollectComponent) },
    { path: 'tasks', loadComponent: () => import('./tasks/tasks.component').then(m => m.TasksComponent) },
    { path: 'friends', loadComponent: () => import('./friends/friends.component').then(m => m.FriendsComponent) },
    { path: 'pumps', loadComponent: () => import('./pumps/pumps.component').then(m => m.PumpsComponent) },
    { path: 'airdrop', loadComponent: () => import('./airdrop/airdrop.component').then(m => m.AirdropComponent) },
  ];