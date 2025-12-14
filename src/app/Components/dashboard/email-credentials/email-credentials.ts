import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailCredentialsService } from '../../../Services/EmailCredentialsService';
import { EmailCredential, AddEmailCredentialRequest } from '../../../models/email-credentials.models';

@Component({
  selector: 'app-email-credentials',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './email-credentials.html',
  styleUrl: './email-credentials.css'
})
export class EmailCredentials implements OnInit {
  credentials = signal<EmailCredential[]>([]);
  isLoading = signal(true);
  showForm = signal(false);
  editingCredential = signal<EmailCredential | null>(null);
  credentialForm: FormGroup;

  constructor(
    private emailCredentialsService: EmailCredentialsService,
    private fb: FormBuilder
  ) {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      smtpServer: [''],
      smtpPort: [587]
    });
  }

  ngOnInit() {
    // Note: API doesn't have GetAllCredentials, so we'll show form only
    this.isLoading.set(false);
  }

  openAddForm() {
    this.editingCredential.set(null);
    this.credentialForm.reset({ smtpPort: 587 });
    this.showForm.set(true);
  }

  openEditForm(credential: EmailCredential) {
    this.editingCredential.set(credential);
    this.credentialForm.patchValue(credential);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingCredential.set(null);
    this.credentialForm.reset();
  }

  onSubmit() {
    if (this.credentialForm.valid) {
      const credentialData: AddEmailCredentialRequest = this.credentialForm.value;
      if (this.editingCredential()) {
        this.emailCredentialsService.updateCredential(this.editingCredential()!.id!, credentialData).subscribe({
          next: () => {
            this.closeForm();
            alert('Email credentials updated successfully!');
          }
        });
      } else {
        this.emailCredentialsService.addCredential(credentialData).subscribe({
          next: () => {
            this.closeForm();
            alert('Email credentials added successfully!');
          }
        });
      }
    }
  }

  deleteCredential(id: number) {
    if (confirm('Are you sure you want to delete these email credentials?')) {
      this.emailCredentialsService.deleteCredential(id).subscribe({
        next: () => {
          alert('Email credentials deleted successfully!');
        }
      });
    }
  }
}