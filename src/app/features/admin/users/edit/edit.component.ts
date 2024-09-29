import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UsersService } from '../../../users/users.service';
import { UserDTO } from '../../../../shared/models/user.dto';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditUserComponent implements OnInit {
  editUserForm: FormGroup;
  user: UserDTO | null = null;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private location: Location,
    private snackBar: MatSnackBar
  ) {
    this.editUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      address: [''],
      telephoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          this.digitsValidator,
        ],
      ],
    });
  }

  ngOnInit(): void {
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
          this.snackBar.open('User updated successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/admin'], { state: { message: 'User updated successfully' } });
        },
        error: (error) => {
          if (error.status === 401) {
            this.snackBar.open('Session expired. Please log in again.', 'Close', {
              duration: 5000,
            });
            this.router.navigate(['/auth/login']);
          }
          console.error('Error updating user', error);
          this.snackBar.open('An error occurred while updating the user.', 'Close', {
            duration: 5000,
          });
        },
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  private digitsValidator(control: AbstractControl) {
    const value = control.value;
    if (value && !/^\d+$/.test(value)) {
      return { digitsOnly: true };
    }
    return null;
  }
}
