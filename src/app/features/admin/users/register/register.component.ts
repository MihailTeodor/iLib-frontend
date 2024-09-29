import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UsersService } from '../../../users/users.service';
import { UserDTO } from '../../../../shared/models/user.dto';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-user',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterUserComponent {
  registerUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      plainPassword: ['', Validators.required],
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

  onSubmit(): void {
    if (this.registerUserForm.valid) {
      const newUser: UserDTO = this.registerUserForm.value;
      this.usersService.createUser(newUser).subscribe({
        next: () => {
          this.snackBar.open('User registered successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/admin'], { state: { message: 'User registered successfully' } });
        },
        error: (error) => {
          if (error.status === 401) {
            this.snackBar.open('Session expired. Please log in again.', 'Close', {
              duration: 5000,
            });
            this.router.navigate(['/auth/login']);
          }
          console.error('Error registering user', error);
          this.snackBar.open(error.error.error, 'Close', {
            duration: 5000,
          });
        },
      });
    }
  }

  private digitsValidator(control: AbstractControl) {
    const value = control.value;
    if (value && !/^\d+$/.test(value)) {
      return { digitsOnly: true };
    }
    return null;
  }
}
