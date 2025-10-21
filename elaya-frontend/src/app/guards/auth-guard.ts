// src/app/guards/auth.guard.ts

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../api/auth';

// Guard pour les routes qui nécessitent d'être connecté
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

// Guard pour les routes admin uniquement
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};

// Guard pour les routes client uniquement
export const clientGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isClient()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};