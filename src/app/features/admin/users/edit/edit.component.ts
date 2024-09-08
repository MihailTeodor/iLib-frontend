import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../users/users.service';
import { UserDTO } from '../../../../shared/models/user.dto';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditUserComponent implements OnInit {
  editUserForm: FormGroup;
  errorMessage: string | null = null;
  user: UserDTO | null = null;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private location: Location
  ) {
    this.editUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      address: [''],
      telephoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    });
  }

  ngOnInit(): void {
    // Pre-fill the form with user data
    if (history.state.user) {
      this.user = history.state.user;
      if (this.user) {
        this.editUserForm.patchValue(this.user);
      }
    } else {
      this.router.navigate(['/users/search']);
    }
  }

  onSubmit(): void {
    if (this.editUserForm.valid && this.user) {
      const updatedUser: UserDTO = { ...this.user, ...this.editUserForm.value };

      this.usersService.updateUser(updatedUser).subscribe({
        next: () => {
          console.log('User updated successfully');
          this.router.navigate(['/admin'], { state: { message: 'User updated successfully' } });
        },
        error: (error) => {
          console.error('Error updating user', error);
          this.errorMessage = 'An error occurred while updating the user.';
        }
      });
    }
  }

  goBack(): void {
    this.location.back();  // Go back to the previous page
  }
}
