import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDTO } from '../../../shared/models/user.dto';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: UserDTO | null = null;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    // Retrieve the user from the router's state
    if (history.state.user) {
      this.user = history.state.user;
    } else {
      // If the user navigated directly here without data, redirect to search or show an error
      this.router.navigate(['/users/search']);
    }
  }

  // Check if the user is an admin
  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'ADMINISTRATOR';
  }
  
  // Navigate to edit form
  editUser(): void {
    this.router.navigate(['/admin/users/edit', this.user?.id], { state: { user: this.user } });
  }

  goBack(): void {
    const searchFormData = history.state.searchFormData;
    const users = history.state.users;
    this.router.navigate(['admin/users/search'], { state: { searchFormData, users } });
  }
}
