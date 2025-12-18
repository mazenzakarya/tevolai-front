import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/AuthService';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Registered user without any role should only see Services section
  if (!authService.hasRole('Admin')) {
    return router.createUrlTree(['/dashboard/services']);
  }

  return true;
};


