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
  private revenueStorageKey = 'tevolai_revenues';

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
    // Load from localStorage since API doesn't have GetAllRevenues
    const stored = localStorage.getItem(this.revenueStorageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.revenues.set(parsed);
      } catch {
        this.revenues.set([]);
      }
    } else {
      this.revenues.set([]);
    }
  }

  private saveRevenues() {
    localStorage.setItem(this.revenueStorageKey, JSON.stringify(this.revenues()));
  }

  loadTotalRevenues() {
    this.revenueService.getTotalRevenuesAmount().subscribe({
      next: (data) => {
        // Calculate from local list if available, otherwise use API total
        const localTotal = this.revenues().reduce((sum, r) => sum + (r.amount || 0), 0);
        this.totalRevenues.set(localTotal > 0 ? localTotal : data.totalAmount);
        this.isLoading.set(false);
      },
      error: () => {
        // Fallback to local calculation
        const localTotal = this.revenues().reduce((sum, r) => sum + (r.amount || 0), 0);
        this.totalRevenues.set(localTotal);
        this.isLoading.set(false);
      }
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
      paymentDate: revenue.paymentDate ? (typeof revenue.paymentDate === 'string' ? revenue.paymentDate.split('T')[0] : new Date(revenue.paymentDate).toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]
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
        customerId: parseInt(this.revenueForm.value.customerId, 10),
        serviceId: parseInt(this.revenueForm.value.serviceId, 10),
        paymentDate: new Date(this.revenueForm.value.paymentDate).toISOString()
      };
      if (this.editingRevenue()) {
        revenueData.id = this.editingRevenue()!.id;
        this.revenueService.editRevenue(revenueData).subscribe({
          next: () => {
            this.revenues.update(revs => 
              revs.map(r => r.id === revenueData.id ? revenueData : r)
            );
            this.saveRevenues();
            this.loadTotalRevenues();
            this.closeForm();
          }
        });
      } else {
        this.revenueService.addRevenue(revenueData).subscribe({
          next: () => {
            // Generate a temporary ID for local tracking
            revenueData.id = Date.now();
            this.revenues.update(revs => [...revs, revenueData]);
            this.saveRevenues();
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
        next: () => {
          this.revenues.update(revs => revs.filter(r => r.id !== id));
          this.saveRevenues();
          this.loadTotalRevenues();
        }
      });
    }
  }

  getCustomerName(customerId: number | string): string {
    const id = typeof customerId === 'string' ? parseInt(customerId, 10) : customerId;
    const customer = this.customers().find(c => c.id === id);
    return customer?.fullName || 'Unknown';
  }

  getServiceName(serviceId: number | string): string {
    const id = typeof serviceId === 'string' ? parseInt(serviceId, 10) : serviceId;
    const service = this.services().find(s => s.id === id);
    return service?.serviceName || 'Unknown';
  }
}