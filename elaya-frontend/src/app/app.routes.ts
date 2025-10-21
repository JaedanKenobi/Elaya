// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Menu } from './pages/menu/menu';
import { Order } from './pages/order/order';
import { Cart } from './pages/cart/cart';
import { Reservation } from './pages/reservation/reservation';
import { Events } from './pages/events/events';
import { Contact } from './pages/contact/contact';
import { Newsletter } from './pages/newsletter/newsletter';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Account } from './pages/account/account';
import { authGuard, clientGuard } from './guards/auth-guard';

export const routes: Routes = [
  // Pages publiques
  { path: '', component: Home },
  { path: 'menu', component: Menu },
  { path: 'events', component: Events },
  { path: 'contact', component: Contact },
  { path: 'newsletter', component: Newsletter },
  { path: 'reservation', component: Reservation },
  
  // Panier (public)
  { path: 'cart', component: Cart },
  
  // Commande (public - pas besoin de compte)
  { path: 'order', component: Order },
  
  // Auth
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  
  // Espace client (protégé)
  { 
    path: 'account', 
    component: Account,
    canActivate: [authGuard] // Nécessite d'être connecté
  },
  
  // Admin (à créer plus tard si besoin)
  // { 
  //   path: 'admin', 
  //   component: Admin,
  //   canActivate: [adminGuard]
  // },
  
  // Fallback
  { path: '**', redirectTo: '' }
];