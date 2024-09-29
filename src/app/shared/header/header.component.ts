import { BackendService } from './../backend.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../features/auth/auth.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  currentBackend: string = '';
  private subscription: Subscription = new Subscription();
  isLoginPage: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.backendService.currentBackendName$.subscribe(
        backendName => (this.currentBackend = backendName)
      )
    );

    this.subscription.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.isLoginPage = this.router.url === '/auth/login';
        }
      })
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