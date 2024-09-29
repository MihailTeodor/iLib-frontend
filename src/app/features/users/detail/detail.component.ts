import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from '../../../shared/models/user.dto';
import { AuthService } from '../../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-details',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: UserDTO | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (history.state.user) {
      this.user = history.state.user;
    } else {
      this.snackBar.open('User not found.', 'Close', {
        duration: 3000,
      });
      this.router.navigate(['/users/search']);
    }
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'ADMINISTRATOR';
  }

  editUser(): void {
    this.router.navigate(['/admin/users/edit', this.user?.id], { state: { user: this.user } });
  }

  goToUserDashboard(): void {
    this.router.navigate(['/admin/dashboard', this.user?.id]);
  }

  goBack(): void {
    const searchFormData = history.state.searchFormData;
    const users = history.state.users;
    this.router.navigate(['admin/users/search'], { state: { searchFormData, users } });
  }
}
