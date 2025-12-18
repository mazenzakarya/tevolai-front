import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationUserService } from '../../../Services/ApplicationUserService';
import { RolesService } from '../../../Services/RolesService';
import { ApplicationUserDto } from '../../../models/application-user.models';

@Component({
  selector: 'app-users',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users = signal<ApplicationUserDto[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  createForm: FormGroup;
  editForm: FormGroup;
  roleForm: FormGroup;
  resetPasswordForm: FormGroup;
  searchForm: FormGroup;

  editingUserId = signal<string | null>(null);
  resettingPasswordUserId = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private usersService: ApplicationUserService,
    private rolesService: RolesService
  ) {
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
    });

    this.editForm = this.fb.group({
      email: ['', [Validators.email]],
      userName: [''],
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
    });

    this.roleForm = this.fb.group({
      userId: ['', [Validators.required]],
      roleName: ['', [Validators.required]],
    });

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.searchForm = this.fb.group({
      email: ['', [Validators.email]],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.usersService.getAll().subscribe({
      next: (data) => {
        this.users.set(Array.isArray(data) ? data : []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to load users.');
        this.users.set([]);
        this.isLoading.set(false);
      },
    });
  }

  createUser(): void {
    if (this.createForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.usersService.create(this.createForm.value).subscribe({
      next: () => {
        this.createForm.reset();
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to create user.');
        this.isLoading.set(false);
      },
    });
  }

  startEdit(user: ApplicationUserDto): void {
    this.editingUserId.set(user.id || null);
    this.editForm.patchValue({
      email: user.email || '',
      userName: user.userName || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phoneNumber: user.phoneNumber || '',
    });
  }

  cancelEdit(): void {
    this.editingUserId.set(null);
    this.editForm.reset();
  }

  saveEdit(): void {
    const id = this.editingUserId();
    if (!id) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.usersService.update(id, this.editForm.value).subscribe({
      next: () => {
        this.cancelEdit();
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to update user.');
        this.isLoading.set(false);
      },
    });
  }

  deleteUser(user: ApplicationUserDto): void {
    if (!user.id) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.usersService.delete(user.id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to delete user.');
        this.isLoading.set(false);
      },
    });
  }

  searchByEmail(): void {
    const email = (this.searchForm.value.email || '').trim();
    if (!email) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.usersService.byEmail(email).subscribe({
      next: (user) => {
        this.users.set(user ? [user] : []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'User not found.');
        this.users.set([]);
        this.isLoading.set(false);
      },
    });
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.loadUsers();
  }

  assignRole(user: ApplicationUserDto): void {
    if (!user.id) return;

    this.roleForm.patchValue({ userId: user.id });
  }

  submitRole(): void {
    if (this.roleForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.rolesService.assign(this.roleForm.value).subscribe({
      next: () => {
        this.roleForm.reset();
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to assign role.');
        this.isLoading.set(false);
      },
    });
  }

  startResetPassword(user: ApplicationUserDto): void {
    this.resettingPasswordUserId.set(user.id || null);
    this.resetPasswordForm.reset();
  }

  cancelResetPassword(): void {
    this.resettingPasswordUserId.set(null);
    this.resetPasswordForm.reset();
  }

  submitResetPassword(): void {
    const id = this.resettingPasswordUserId();
    if (!id || this.resetPasswordForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.usersService.resetPassword(id, this.resetPasswordForm.value).subscribe({
      next: () => {
        this.cancelResetPassword();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to reset password.');
        this.isLoading.set(false);
      },
    });
  }

  createRole(): void {
    const roleName = (this.roleForm.value.roleName || '').trim();
    if (!roleName) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.rolesService.createRole({ roleName }).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to create role.');
        this.isLoading.set(false);
      },
    });
  }
}


