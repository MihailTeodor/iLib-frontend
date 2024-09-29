import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { BackendService } from '../../../shared/backend.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  environmentLabel: string = 'Switch to C# Backend';
  currentBackend: string = '';
  hide = true;



  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private backendService: BackendService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });
  }

  ngOnInit(): void {
    this.currentBackend = this.backendService.getCurrentBackendName();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          const userRole = response.role;
          if (userRole === 'ADMINISTRATOR') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/users']);
          }
        },
        error: (error) => {
          let message = 'Login failed. Please try again.';
          if (error.status === 401) {
            message = 'Invalid email or password. Please try again.';
          }
          this.snackBar.open(message, 'Close', {
            duration: 5000,
          });
        }
      });
    }
  }
  

  switchBackend(): void {
    if (this.environmentLabel === 'Switch to C# Backend') {
      this.backendService.switchToCsharpBackend();
      this.environmentLabel = 'Switch to Java Backend';
    } else {
      this.backendService.switchToJavaBackend();
      this.environmentLabel = 'Switch to C# Backend';
    }
    this.currentBackend = this.backendService.getCurrentBackendName();
  }
}
