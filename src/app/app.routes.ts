import { Routes } from '@angular/router';
import { CollectComponent } from './collect/collect.component';
import { TasksComponent } from './tasks/tasks.component';
import { FriendsComponent } from './friends/friends.component';
import { PumpsComponent } from './pumps/pumps.component';
import { AirdropComponent } from './airdrop/airdrop.component';
import { GreenComponent } from './green/green.component';

// export const routes: Routes = [
//     { path: '', redirectTo: '/collect', pathMatch: 'full' },
//     { path: 'collect', loadComponent: () => import('./collect/collect.component').then(m => m.CollectComponent) },
//     { path: 'tasks', loadComponent: () => import('./tasks/tasks.component').then(m => m.TasksComponent) },
//     { path: 'friends', loadComponent: () => import('./friends/friends.component').then(m => m.FriendsComponent) },
//     { path: 'pumps', loadComponent: () => import('./pumps/pumps.component').then(m => m.PumpsComponent) },
//     { path: 'airdrop', loadComponent: () => import('./airdrop/airdrop.component').then(m => m.AirdropComponent) },
//     { path: 'green', loadComponent: () => import('./green/green.component').then(m => m.GreenComponent) },
//   ];

export const routes: Routes = [
  { path: '', redirectTo: '/collect', pathMatch: 'full' },
  { path: 'collect', component: CollectComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'friends', component: FriendsComponent },
  { path: 'pumps', component: PumpsComponent },
  { path: 'airdrop', component: AirdropComponent },
  { path: 'green', component: GreenComponent },
];