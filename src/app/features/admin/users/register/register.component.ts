import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../users/users.service';
import { UserDTO } from '../../../../shared/models/user.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterUserComponent {
  registerUserForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private usersService: UsersService,
    private router: Router
  ) {
    this.registerUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      plainPassword: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      address: [''],
      telephoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    });
  }

  onSubmit(): void {
    if (this.registerUserForm.valid) {
      const newUser: UserDTO = this.registerUserForm.value;
      this.usersService.createUser(newUser).subscribe({
        next: () => {
          console.log('User registered successfully');
          this.router.navigate(['/admin'], { state: { message: 'User registered successfully' } });
        },
        error: (error) => {
          console.error('Error registering user', error);
          this.errorMessage = 'An error occurred while registering the user.';
        }
      });
    }
  }
}
