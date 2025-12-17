import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../../Services/CustomerService';
import { Customer as CustomerModel } from '../../../models/customer.models';

@Component({
  selector: 'app-customer',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer.html',
  styleUrl: './customer.css'
})
export class Customer implements OnInit {
  customers = signal<CustomerModel[]>([]);
  isLoading = signal(true);
  showForm = signal(false);
  editingCustomer = signal<CustomerModel | null>(null);
  customerForm: FormGroup;
  searchTerm = signal('');

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder
  ) {
    this.customerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phone: [''],
      companyName: [''],
      country: [''],
      notes: ['']
    });
  }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading.set(true);
    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  searchCustomers() {
    const term = this.searchTerm();
    if (term.trim()) {
      this.customerService.searchCustomers(term).subscribe({
        next: (data) => this.customers.set(data),
        error: () => {}
      });
    } else {
      this.loadCustomers();
    }
  }

  openAddForm() {
    this.editingCustomer.set(null);
    this.customerForm.reset();
    this.showForm.set(true);
  }

  openEditForm(customer: CustomerModel) {
    this.editingCustomer.set(customer);
    this.customerForm.patchValue(customer);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingCustomer.set(null);
    this.customerForm.reset();
  }

  onSubmit() {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;
      if (this.editingCustomer()) {
        customerData.id = this.editingCustomer()!.id;
        this.customerService.updateCustomer(customerData).subscribe({
          next: () => {
            this.loadCustomers();
            this.closeForm();
          }
        });
      } else {
        this.customerService.addCustomer(customerData).subscribe({
          next: () => {
            this.loadCustomers();
            this.closeForm();
          }
        });
      }
    }
  }

  deleteCustomer(id: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => this.loadCustomers()
      });
    }
  }
}