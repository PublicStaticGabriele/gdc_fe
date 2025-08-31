import { Routes } from '@angular/router';
import {authGuard} from './core/auth.guard';
import {LoginComponent} from './login/login';
import {ResetPasswordComponent} from './user/reset-password-page/reset-password-page.component';

export const routes: Routes = [
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

