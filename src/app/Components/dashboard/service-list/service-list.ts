import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicesOnDashBoardService } from '../../../Services/ServicesOnDashBoardService';
import { ServicesOnDashBoard, ServiesOnDashBoardDto, WebsiteCMS, WebsiteStatus } from '../../../models/services.models';
import { CustomerService } from '../../../Services/CustomerService';
import { Customer } from '../../../models/customer.models';

@Component({
  selector: 'app-service-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './service-list.html',
  styleUrl: './service-list.css'
})
export class ServiceList implements OnInit {
  services = signal<ServicesOnDashBoard[]>([]);
  customers = signal<Customer[]>([]);
  isLoading = signal(true);
  showForm = signal(false);
  editingService = signal<ServicesOnDashBoard | null>(null);
  serviceForm: FormGroup;
  cmsOptions = Object.values(WebsiteCMS).filter(v => typeof v === 'number');
  statusOptions = Object.values(WebsiteStatus).filter(v => typeof v === 'number');
  cmsLabels = ['WordPress', 'Shopify', 'Custom', 'Other'];
  statusLabels = ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];

  constructor(
    private servicesService: ServicesOnDashBoardService,
    private customerService: CustomerService,
    private fb: FormBuilder
  ) {
    this.serviceForm = this.fb.group({
      serviceName: ['', [Validators.required]],
      description: [''],
      cms: [WebsiteCMS.WordPress, [Validators.required]],
      status: [WebsiteStatus.Planning, [Validators.required]],
      customerId: [''],
      startDate: [''],
      endDate: [''],
      price: [0]
    });
  }

  ngOnInit() {
    this.loadServices();
    this.loadCustomers();
  }

  loadServices() {
    this.isLoading.set(true);
    this.servicesService.getAllServices().subscribe({
      next: (data) => {
        this.services.set(data);
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

  openAddForm() {
    this.editingService.set(null);
    this.serviceForm.reset();
    this.showForm.set(true);
  }

  openEditForm(service: ServicesOnDashBoard) {
    this.editingService.set(service);
    this.serviceForm.patchValue({
      ...service,
      startDate: service.startDate ? new Date(service.startDate).toISOString().split('T')[0] : '',
      endDate: service.endDate ? new Date(service.endDate).toISOString().split('T')[0] : ''
    });
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingService.set(null);
    this.serviceForm.reset();
  }

  onSubmit() {
    if (this.serviceForm.valid) {
      const serviceData: ServiesOnDashBoardDto = this.serviceForm.value;
      if (this.editingService()) {
        serviceData.id = this.editingService()!.id;
        this.servicesService.updateService(serviceData).subscribe({
          next: () => {
            this.loadServices();
            this.closeForm();
          }
        });
      } else {
        this.servicesService.addService(serviceData).subscribe({
          next: () => {
            this.loadServices();
            this.closeForm();
          }
        });
      }
    }
  }

  deleteService(id: number) {
    if (confirm('Are you sure you want to delete this service?')) {
      this.servicesService.deleteService(id).subscribe({
        next: () => this.loadServices()
      });
    }
  }

  getCMSLabel(cms: number): string {
    return this.cmsLabels[cms] || 'Unknown';
  }

  getStatusLabel(status: number): string {
    return this.statusLabels[status] || 'Unknown';
  }

  getStatusClass(status: number): string {
    const classes = ['status-planning', 'status-progress', 'status-completed', 'status-hold', 'status-cancelled'];
    return classes[status] || '';
  }
}