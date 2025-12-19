import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicesOnDashBoardService } from '../../../Services/ServicesOnDashBoardService';
import {
  ServicesOnDashBoard,
  ServiesOnDashBoardDto,
  WebsiteCMS,
  WebsiteStatus,
  PaymentStatus,
} from '../../../models/services.models';
import { CustomerService } from '../../../Services/CustomerService';
import { Customer } from '../../../models/customer.models';
import { AuthService } from '../../../Services/AuthService';
import { ApplicationUserService } from '../../../Services/ApplicationUserService';
import { ApplicationUserDto } from '../../../models/application-user.models';

@Component({
  selector: 'app-service-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './service-list.html',
  styleUrl: './service-list.css',
})
export class ServiceList implements OnInit {
  services = signal<ServicesOnDashBoard[]>([]);
  customers = signal<Customer[]>([]);
  users = signal<ApplicationUserDto[]>([]);
  isLoading = signal(true);
  showForm = signal(false);
  editingService = signal<ServicesOnDashBoard | null>(null);
  serviceForm: FormGroup;
  cmsOptions = Object.values(WebsiteCMS).filter((v) => typeof v === 'number');
  statusOptions = Object.values(WebsiteStatus).filter((v) => typeof v === 'number');
  paymentStatusOptions = Object.values(PaymentStatus).filter((v) => typeof v === 'number');
  cmsLabels = ['WordPress', 'DotNet', 'Joomla', 'Drupal', 'Custom'];
  statusLabels = ['Active', 'Suspended', 'InProgress'];
  paymentStatusLabels = ['Paid', 'Unpaid', 'Partial Paid'];
  isAdmin = signal(false);

  constructor(
    private servicesService: ServicesOnDashBoardService,
    private customerService: CustomerService,
    private authService: AuthService,
    private userService: ApplicationUserService,
    private fb: FormBuilder
  ) {
    this.serviceForm = this.fb.group({
      serviceName: ['', [Validators.required]],
      domain: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      cms: [WebsiteCMS.WordPress, [Validators.required]],
      status: [WebsiteStatus.Active, [Validators.required]],
      paymentStatus: [PaymentStatus.Unpaid],
      customerId: ['', [Validators.required]],
      applicationUserId: [''],
      hostingServer: [''],
      notes: [''],
    });
  }

  ngOnInit() {
    this.isAdmin.set(this.authService.hasRole('Admin'));
    this.loadServices();
    if (this.isAdmin()) {
      this.loadCustomers();
      this.loadUsers();
    }
  }

  loadServices() {
    this.isLoading.set(true);
    const isAdmin = this.authService.hasRole('Admin');
    console.log('Loading services - Is Admin:', isAdmin);

    if (isAdmin) {
      // Admin can see all services
      console.log('Loading all services for admin');
      this.servicesService.getAllServices().subscribe({
        next: (data) => {
          console.log('All services loaded:', data.length);
          this.services.set(data);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading all services:', error);
          this.isLoading.set(false);
        },
      });
    } else {
      // Regular users can only see their own services
      const userId = this.authService.getCurrentUserId();
      const userEmail = this.authService.getCurrentUserEmail();
      console.log('Loading services for user - User ID:', userId, 'User Email:', userEmail);

      if (userId) {
        console.log('Calling GetServicesByUserId with userId:', userId);
        this.servicesService.getServicesByUserId(userId).subscribe({
          next: (data) => {
            console.log('User services loaded:', data.length, data);
            this.services.set(data);
            this.isLoading.set(false);
          },
          error: (error) => {
            console.error('Error loading user services by userId:', error);
            // Try with email as fallback
            if (userEmail) {
              console.log('Trying with email instead:', userEmail);
              // Note: This would require a backend endpoint that accepts email
              // For now, just set empty services
            }
            this.isLoading.set(false);
          },
        });
      } else {
        console.warn('No user ID found, cannot load services');
        this.isLoading.set(false);
      }
    }
  }

  loadCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (data) => this.customers.set(data),
    });
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (data) => this.users.set(data),
    });
  }

  openAddForm() {
    if (!this.isAdmin()) return;
    this.editingService.set(null);
    this.serviceForm.reset({
      paymentStatus: PaymentStatus.Unpaid, // Default to unpaid
    });
    this.showForm.set(true);
  }

  openEditForm(service: ServicesOnDashBoard) {
    if (!this.isAdmin()) return;
    this.editingService.set(service);
    this.serviceForm.patchValue({
      serviceName: service.serviceName,
      domain: service.domain || '',
      userName: service.userName || '',
      cms: service.cms, // Already a number from enum
      status: service.status, // Already a number from enum
      paymentStatus: service.paymentStatus ?? PaymentStatus.Unpaid,
      customerId: service.customerId,
      applicationUserId: service.applicationUserId || '',
      hostingServer: service.hostingServer || '',
      notes: service.notes || '',
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
      const formValue = this.serviceForm.value;
      let applicationUserId = formValue.applicationUserId;

      // If not admin and no applicationUserId specified, assign to current user
      if (!this.isAdmin() && !applicationUserId) {
        applicationUserId = this.authService.getCurrentUserId();
      }

      const serviceData: ServiesOnDashBoardDto = {
        ...formValue,
        cms: Number(formValue.cms), // Ensure CMS is sent as number
        status: Number(formValue.status), // Ensure status is sent as number
        paymentStatus: Number(formValue.paymentStatus), // Ensure paymentStatus is sent as number
        customerId: Number(formValue.customerId), // Ensure customerId is sent as number
        applicationUserId: applicationUserId || undefined, // Only include applicationUserId if provided
        isDeleted: false, // Ensure new services are not deleted
      };

      console.log('Submitting service data:', serviceData);

      if (this.editingService()) {
        serviceData.id = this.editingService()!.id;
        this.servicesService.updateService(serviceData).subscribe({
          next: () => {
            this.loadServices();
            this.closeForm();
          },
        });
      } else {
        this.servicesService.addService(serviceData).subscribe({
          next: () => {
            this.loadServices();
            this.closeForm();
          },
        });
      }
    }
  }

  deleteService(id: number) {
    if (!this.isAdmin()) return;
    if (confirm('Are you sure you want to delete this service?')) {
      this.servicesService.deleteService(id).subscribe({
        next: () => this.loadServices(),
      });
    }
  }

  getCMSLabel(cms: number): string {
    return this.cmsLabels[cms] || 'Unknown';
  }

  getStatusLabel(status: number): string {
    return this.statusLabels[status] || 'Unknown';
  }

  getPaymentStatusLabel(paymentStatus: number): string {
    return this.paymentStatusLabels[paymentStatus] || 'Unknown';
  }

  getStatusClass(status: number): string {
    const classes = ['status-active', 'status-suspended', 'status-inprogress'];
    return classes[status] || '';
  }
}
