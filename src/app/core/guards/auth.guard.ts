import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    const userRole = this.authService.getUserRole();

    if (isAuthenticated && userRole === 'ADMINISTRATOR') {
      return true;  // Allow access if user is authenticated and has 'ADMINISTRATOR' role
    }

    // Redirect to login page if not authenticated or role is not 'ADMINISTRATOR'
    this.router.navigate(['/auth/login']);
    return false;
  }
}
