import { BackendService } from './../backend.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../features/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  currentBackend: string = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    this.subscription = this.backendService.currentBackendName$.subscribe(
      backendName => this.currentBackend = backendName
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

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