import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { RevenueService } from '../../../Services/RevenueService';
import { ExpenseService } from '../../../Services/ExpenseService';
import { CustomerService } from '../../../Services/CustomerService';
import { ServicesOnDashBoardService } from '../../../Services/ServicesOnDashBoardService';
import { ContactMessageService } from '../../../Services/ContactMessageService';
import { SeoService } from '../../../Services/SeoService';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule, RouterOutlet, RouterLink, Sidebar],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage implements OnInit {
  totalRevenue = signal<number>(0);
  totalExpenses = signal<number>(0);
  totalCustomers = signal<number>(0);
  totalServices = signal<number>(0);
  unreadMessages = signal<number>(0);
  isLoading = signal(true);

  constructor(
    private revenueService: RevenueService,
    private expenseService: ExpenseService,
    private customerService: CustomerService,
    private servicesService: ServicesOnDashBoardService,
    private contactMessageService: ContactMessageService,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    // Prevent dashboard from being indexed by search engines
    this.seoService.setDashboardNoIndex();
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading.set(true);

    // Load total revenue
    this.revenueService.getTotalRevenuesAmount().subscribe({
      next: (data) => this.totalRevenue.set(data.totalAmount),
      error: () => this.totalRevenue.set(0)
    });

    // Load expenses count
    this.expenseService.getTotalExpensesAmount().subscribe({
      next: (data) => this.totalExpenses.set(data.totalAmount),
      error: () => this.totalExpenses.set(0)
    });

    // Load customers count
    this.customerService.getAllCustomers().subscribe({
      next: (data) => this.totalCustomers.set(data.length),
      error: () => this.totalCustomers.set(0)
    });

    // Load services count
    this.servicesService.getAllServices().subscribe({
      next: (data) => this.totalServices.set(data.length),
      error: () => this.totalServices.set(0)
    });

    // Load unread messages
    this.contactMessageService.getContactMessagesByReadStatus(false).subscribe({
      next: (data) => {
        this.unreadMessages.set(data.length);
        this.isLoading.set(false);
      },
      error: () => {
        this.unreadMessages.set(0);
        this.isLoading.set(false);
      }
    });
  }
}