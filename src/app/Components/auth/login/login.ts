import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/AuthService';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.authService.setToken(response.token);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Login failed. Please try again.');
          this.isLoading.set(false);
        },
      });
    }
  }
}
