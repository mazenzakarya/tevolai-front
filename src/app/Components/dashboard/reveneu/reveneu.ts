import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RevenueService } from '../../../Services/RevenueService';
import { RevenueDto } from '../../../models/revenue.models';
import { CustomerService } from '../../../Services/CustomerService';
import { ServicesOnDashBoardService } from '../../../Services/ServicesOnDashBoardService';
import { Customer } from '../../../models/customer.models';
import { ServicesOnDashBoard } from '../../../models/services.models';

@Component({
  selector: 'app-reveneu',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reveneu.html',
  styleUrl: './reveneu.css',
})
export class Reveneu implements OnInit {
  revenues = signal<RevenueDto[]>([]);
  customers = signal<Customer[]>([]);
  services = signal<ServicesOnDashBoard[]>([]);
  totalRevenues = signal<number>(0);
  isLoading = signal(true);
  showForm = signal(false);
  editingRevenue = signal<RevenueDto | null>(null);
  revenueForm: FormGroup;

  constructor(
    private revenueService: RevenueService,
    private customerService: CustomerService,
    private servicesService: ServicesOnDashBoardService,
    private fb: FormBuilder
  ) {
    this.revenueForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0.01)]],
      paymentDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      paymentMethod: ['', [Validators.required]],
      customerId: ['', [Validators.required]],
      serviceId: ['', [Validators.required]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadRevenues();
    this.loadCustomers();
    this.loadServices();
    this.loadTotalRevenues();
  }

  loadRevenues() {
    // Note: API doesn't have GetAllRevenues, so we'll need to track them locally
    // For now, we'll show total only
  }

  loadTotalRevenues() {
    this.revenueService.getTotalRevenues().subscribe({
      next: (value) => {
        this.totalRevenues.set(value);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (data) => this.customers.set(data)
    });
  }

  loadServices() {
    this.servicesService.getAllServices().subscribe({
      next: (data) => this.services.set(data)
    });
  }

  openAddForm() {
    this.editingRevenue.set(null);
    this.revenueForm.reset({
      paymentDate: new Date().toISOString().split('T')[0],
      amount: 0
    });
    this.showForm.set(true);
  }

  openEditForm(revenue: RevenueDto) {
    this.editingRevenue.set(revenue);
    this.revenueForm.patchValue({
      ...revenue,
      paymentDate: new Date(revenue.paymentDate).toISOString().split('T')[0]
    });
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingRevenue.set(null);
    this.revenueForm.reset();
  }

  onSubmit() {
    if (this.revenueForm.valid) {
      const revenueData: RevenueDto = {
        ...this.revenueForm.value,
        paymentDate: new Date(this.revenueForm.value.paymentDate)
      };
      if (this.editingRevenue()) {
        revenueData.id = this.editingRevenue()!.id;
        this.revenueService.editRevenue(revenueData).subscribe({
          next: () => {
            this.loadTotalRevenues();
            this.closeForm();
          }
        });
      } else {
        this.revenueService.addRevenue(revenueData).subscribe({
          next: () => {
            this.loadTotalRevenues();
            this.closeForm();
          }
        });
      }
    }
  }

  deleteRevenue(id: number) {
    if (confirm('Are you sure you want to delete this revenue record?')) {
      this.revenueService.deleteRevenue(id).subscribe({
        next: () => this.loadTotalRevenues()
      });
    }
  }
}