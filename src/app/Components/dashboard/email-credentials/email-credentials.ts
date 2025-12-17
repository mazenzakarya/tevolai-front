import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailCredentialsService } from '../../../Services/EmailCredentialsService';
import {
  EmailCredential,
  AddEmailCredentialRequest,
} from '../../../models/email-credentials.models';
import { CustomerService } from '../../../Services/CustomerService';
import { Customer } from '../../../models/customer.models';

@Component({
  selector: 'app-email-credentials',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './email-credentials.html',
  styleUrl: './email-credentials.css',
})
export class EmailCredentials implements OnInit {
  credentials = signal<EmailCredential[]>([]);
  isLoading = signal(true);
  showForm = signal(false);
  editingCredential = signal<EmailCredential | null>(null);
  customers = signal<Customer[]>([]);
  selectedCustomerId = signal<number | null>(null);
  shownPasswords = signal<Set<number>>(new Set());
  credentialForm: FormGroup;

  constructor(
    private customerService: CustomerService,
    private emailCredentialsService: EmailCredentialsService,
    private fb: FormBuilder
  ) {
    this.credentialForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      userName: [''],
      hostingPlatform: [''],
      notes: [''],
      customerId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.loadCredentials();
    this.loadCustomers();
  }

  loadCredentials() {
    this.emailCredentialsService.getAllCredentials().subscribe({
      next: (data) => {
        this.credentials.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  openAddForm() {
    this.editingCredential.set(null);
    this.credentialForm.reset();
    this.showForm.set(true);
  }

  openEditForm(credential: EmailCredential) {
    this.editingCredential.set(credential);
    const formData = {
      ...credential,
      password: credential.decryptedPassword || credential.password,
    };
    this.credentialForm.patchValue(formData);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingCredential.set(null);
    this.credentialForm.reset();
  }
  loadCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (data) => this.customers.set(data),
    });
  }

  onCustomerChange(customerId: string) {
    this.selectedCustomerId.set(customerId ? +customerId : null);
  }

  getFilteredCredentials() {
    const selectedId = this.selectedCustomerId();
    if (!selectedId) return [];
    return this.credentials().filter((cred) => cred.customerId === selectedId);
  }

  get selectedCustomerName() {
    const selectedId = this.selectedCustomerId();
    if (!selectedId) return '';
    return this.customers().find((c) => c.id === selectedId)?.fullName || '';
  }
  togglePasswordVisibility(credentialId: number) {
    const currentShown = this.shownPasswords();
    const newShown = new Set(currentShown);
    if (newShown.has(credentialId)) {
      newShown.delete(credentialId);
    } else {
      // Fetch password if not already loaded
      const credential = this.credentials().find((c) => c.id === credentialId);
      if (
        credential &&
        (credential.password === undefined ||
          credential.password === null ||
          credential.password === '') &&
        (credential.decryptedPassword === undefined ||
          credential.decryptedPassword === null ||
          credential.decryptedPassword === '')
      ) {
        this.emailCredentialsService.getCredentialWithPassword(credentialId).subscribe({
          next: (data) => {
            // Update the credential with the full data including password
            const updatedCredentials = this.credentials().map((c) =>
              c.id === credentialId ? { ...data } : c
            );
            this.credentials.set(updatedCredentials);
            newShown.add(credentialId);
            this.shownPasswords.set(newShown);
          },
          error: (error) => {
            console.error('Error fetching password:', error);
            // Still show the toggle as if password is available
            newShown.add(credentialId);
            this.shownPasswords.set(newShown);
          },
        });
      } else {
        newShown.add(credentialId);
        this.shownPasswords.set(newShown);
      }
    }
    this.shownPasswords.set(newShown);
  }

  isPasswordVisible(credentialId: number): boolean {
    return this.shownPasswords().has(credentialId);
  }
  onSubmit() {
    if (this.credentialForm.valid) {
      const credentialData: AddEmailCredentialRequest = this.credentialForm.value;
      if (this.editingCredential()) {
        const updateData = {
          id: this.editingCredential()!.id!,
          ...credentialData,
        };
        this.emailCredentialsService.updateCredential(updateData).subscribe({
          next: () => {
            this.closeForm();
            alert('Email credentials updated successfully!');
          },
        });
      } else {
        this.emailCredentialsService.addCredential(credentialData).subscribe({
          next: () => {
            this.closeForm();
            alert('Email credentials added successfully!');
          },
        });
      }
    }
  }

  deleteCredential(id: number) {
    if (confirm('Are you sure you want to delete these email credentials?')) {
      this.emailCredentialsService.deleteCredential(id).subscribe({
        next: () => {
          alert('Email credentials deleted successfully!');
        },
      });
    }
  }
}
