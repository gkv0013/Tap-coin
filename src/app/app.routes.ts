import { Routes } from '@angular/router';
import { CollectComponent } from './collect/collect.component';
import { TasksComponent } from './tasks/tasks.component';
import { FriendsComponent } from './friends/friends.component';
import { BoostComponent } from './boost/boost.component';
import { AirdropComponent } from './airdrop/airdrop.component';
import { GreenComponent } from './green/green.component';
import { GoalComponent } from './goals/goals.component';
import { MoreInfoComponent } from './more-info/more-info.component';
import { LogsComponent } from './logs/logs.component';

// export const routes: Routes = [
//     { path: '', redirectTo: '/collect', pathMatch: 'full' },
//     { path: 'collect', loadComponent: () => import('./collect/collect.component').then(m => m.CollectComponent) },
//     { path: 'tasks', loadComponent: () => import('./tasks/tasks.component').then(m => m.TasksComponent) },
//     { path: 'friends', loadComponent: () => import('./friends/friends.component').then(m => m.FriendsComponent) },
//     { path: 'boost', loadComponent: () => import('./boost/boost.component').then(m => m.BoostComponent) },
//     { path: 'airdrop', loadComponent: () => import('./airdrop/airdrop.component').then(m => m.AirdropComponent) },
//     { path: 'green', loadComponent: () => import('./green/green.component').then(m => m.GreenComponent) },
//   ];

export const routes: Routes = [
  { path: '', redirectTo: '/collect', pathMatch: 'full' },
  { 
    path: 'logs', 
    loadComponent: () => import('./logs/logs.component').then(m => m.LogsComponent) 
  },
  { 
    path: 'collect', 
    loadComponent: () => import('./collect/collect.component').then(m => m.CollectComponent) 
  },
  { 
    path: 'tasks', 
    loadComponent: () => import('./tasks/tasks.component').then(m => m.TasksComponent) 
  },
  { 
    path: 'friends', 
    loadComponent: () => import('./friends/friends.component').then(m => m.FriendsComponent) 
  },
  { 
    path: 'boost', 
    loadComponent: () => import('./boost/boost.component').then(m => m.BoostComponent) 
  },
  { 
    path: 'airdrop', 
    loadComponent: () => import('./airdrop/airdrop.component').then(m => m.AirdropComponent) 
  },
  { 
    path: 'green', 
    loadComponent: () => import('./green/green.component').then(m => m.GreenComponent) 
  },
  { 
    path: 'more-info', 
    loadComponent: () => import('./more-info/more-info.component').then(m => m.MoreInfoComponent) 
  },
  { 
    path: 'goals/:id', 
    loadComponent: () => import('./goals/goals.component').then(m => m.GoalComponent) 
  }
];
