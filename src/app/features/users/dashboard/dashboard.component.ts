import { Component, OnInit } from '@angular/core';
import { UserDashboardDTO } from '../../../shared/models/user-dashboard.dto';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  userInfo: UserDashboardDTO | null = null;
  errorMessage: string | null = null;
  
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId(); 
    this.usersService.getUserInfo(userId!).subscribe({
      next: (data) => {
        this.userInfo = data;
      },
      error: (error) => {
        console.error('Error fetching user info:', error);
        this.errorMessage = 'An error occurred while fetching your information.';
      }
    });
  }

  searchArticles(): void {
    this.router.navigate(['/articles/search']);
  }
}