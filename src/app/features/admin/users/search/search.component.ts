import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersService } from '../../../users/users.service';
import { UserDTO } from '../../../../shared/models/user.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search-users',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchUsersComponent {
  searchForm: FormGroup;
  users: UserDTO[] = [];
  totalResults: number = 0;
  totalPages: number = 1;
  currentPage: number = 1;
  formCollapsed: boolean = false;
  resultsPerPageOptions = [5, 10, 15, 20];

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      surname: [''],
      email: [''],
      telephoneNumber: [''],
      pageNumber: [1],
      resultsPerPage: [10]
    });
  }

  ngOnInit(): void {
    if (history.state.searchFormData && history.state.users) {
      this.searchForm.patchValue(history.state.searchFormData);
      this.users = history.state.users;
      this.totalResults = this.users.length;
      this.formCollapsed = this.totalResults > 0;
    }
  }

  onSubmit(): void {
    this.usersService.searchUsers(this.searchForm.value).subscribe({
      next: (response) => {
        this.users = response.items;
        this.totalResults = response.totalResults;
        this.totalPages = response.totalPages;
        this.currentPage = response.pageNumber;
        this.formCollapsed = true;
      },
      error: (error) => {
        if (error.status === 404 && error.error.error === 'Search has given no results!') {
          this.users = [];
          this.totalResults = 0;
          this.snackBar.open('No users found. Please try a different search.', 'Close', {
            duration: 5000,
          });
        } if (error.status === 401) {
          this.snackBar.open('Session expired. Please log in again.', 'Close', {
            duration: 5000,
          });
          this.router.navigate(['/auth/login']);
        } else {
          console.error('Error fetching users', error);
          this.snackBar.open('An error occurred during the search. Please try again.', 'Close', {
            duration: 5000,
          });
        }
      }
    });
  }

  toggleForm(): void {
    this.formCollapsed = !this.formCollapsed;
  }

  goToPage(pageNumber: number): void {
    this.searchForm.get('pageNumber')?.setValue(pageNumber);
    this.onSubmit();
  }

  onResultsPerPageChange(): void {
    this.searchForm.get('pageNumber')?.setValue(1);
  }
}
