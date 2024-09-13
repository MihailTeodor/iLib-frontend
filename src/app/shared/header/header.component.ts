import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../features/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isUserAdmin(): boolean {
    return this.authService.getUserRole() === 'ADMINISTRATOR';
  }

  goHome(): void {
    this.isUserAdmin() ? this.router.navigate(['/admin']) : this.router.navigate(['/users']);
  }

  logout(): void {
    this.authService.logout();
  }
}