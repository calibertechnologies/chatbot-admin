import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    alert('Your session has expired. Please log in again.');
    auth.logout();
    router.navigate(['/login']);
    return false;
  }

  return true;
};

export const superadminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn() || auth.getRole() !== 'superadmin') {
    alert('Unauthorized');
    auth.logout();
    router.navigate(['/login']);
    return false;
  }

  return true;
};

export const partnerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn() || auth.getRole() !== 'partner') {
    alert('Unauthorized');
    auth.logout();
    router.navigate(['/login']);
    return false;
  }

  return true;
};

export const clientGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn() || auth.getRole() !== 'client') {
    alert('Unauthorized');
    auth.logout();
    router.navigate(['/login']);
    return false;
  }

  return true;
};