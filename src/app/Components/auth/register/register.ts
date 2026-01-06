import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/AuthService';
import { RegisterDto } from '../../../models/auth.models';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        userName: ['', [Validators.required, Validators.minLength(3)]],
        fullName: [''],
        phoneNumber: ['', [Validators.pattern(/^[0-9+\s-]{6,20}$/)]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      const { confirmPassword, ...rawRegisterData } = this.registerForm.value;
      const normalizedPhone = this.normalizePhoneNumber(rawRegisterData.phoneNumber);

      const registerData: RegisterDto = {
        email: (rawRegisterData.email || '').trim(),
        password: rawRegisterData.password,
        userName: (rawRegisterData.userName || '').trim(),
        fullName: rawRegisterData.fullName?.trim() || '',
        phoneNumber: normalizedPhone || '',
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.successMessage.set('Registration successful! Redirecting...');
          this.authService.setToken(response.token);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          let errorMsg = 'Registration failed. Please try again.';

          // Check for detailed error messages from backend
          if (error.error?.message) {
            errorMsg = error.error.message;
          } else if (error.error?.errors) {
            // Handle validation errors object
            const errorDetails = Object.values(error.error.errors);
            if (Array.isArray(errorDetails[0])) {
              errorMsg = (errorDetails[0] as string[])[0];
            }
          } else if (error.error instanceof Object) {
            // Fallback: try to get any error info from response
            const keys = Object.keys(error.error);
            if (keys.length > 0) {
              errorMsg = error.error[keys[0]];
            }
          }

          this.errorMessage.set(errorMsg);
          this.isLoading.set(false);
        },
      });
    }
  }

  private normalizeDigits(value: string): string {
    const map: Record<string, string> = {
      '٠': '0',
      '١': '1',
      '٢': '2',
      '٣': '3',
      '٤': '4',
      '٥': '5',
      '٦': '6',
      '٧': '7',
      '٨': '8',
      '٩': '9',
    };

    return value
      .split('')
      .map((char) => map[char] ?? char)
      .join('');
  }

  private normalizePhoneNumber(value: string | null | undefined): string | undefined {
    if (!value) return undefined;

    const digits = this.normalizeDigits(value).trim();
    if (!digits) return undefined;

    // Keep only digits and a single leading plus if the user provided one
    let cleaned = digits.replace(/[^0-9+]/g, '');
    if (cleaned.startsWith('+')) {
      cleaned = '+' + cleaned.slice(1).replace(/\+/g, '');
    } else {
      cleaned = cleaned.replace(/\+/g, '');
    }

    return cleaned.length > 0 ? cleaned : undefined;
  }
}
