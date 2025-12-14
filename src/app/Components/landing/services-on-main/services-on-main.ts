import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesOnMainService } from '../../../Services/ServicesOnMainService';
import { ServicesOnMainDto } from '../../../models/services.models';

@Component({
  selector: 'app-services-on-main',
  imports: [CommonModule],
  templateUrl: './services-on-main.html',
  styleUrl: './services-on-main.css',
})
export class ServicesOnMain implements OnInit {
  services = signal<ServicesOnMainDto[]>([]);
  isLoading = signal(true);

  constructor(private servicesOnMainService: ServicesOnMainService) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.servicesOnMainService.getAllServices().subscribe({
      next: (data) => {
        this.services.set(data.filter(s => s.isActive !== false));
        this.isLoading.set(false);
      },
      error: () => {
        // Fallback to default services if API fails
        this.services.set(this.getDefaultServices());
        this.isLoading.set(false);
      }
    });
  }

  getDefaultServices(): ServicesOnMainDto[] {
    return [
      {
        id: 1,
        title: 'Custom Web Development',
        description: 'Build powerful, scalable web applications tailored to your business needs',
        icon: '💻',
        isActive: true,
        order: 1
      },
      {
        id: 2,
        title: 'WordPress Solutions',
        description: 'Professional WordPress websites with custom themes and plugins',
        icon: '📝',
        isActive: true,
        order: 2
      },
      {
        id: 3,
        title: 'E-Commerce Platforms',
        description: 'Complete online stores with payment integration and inventory management',
        icon: '🛒',
        isActive: true,
        order: 3
      },
      {
        id: 4,
        title: 'UI/UX Design',
        description: 'Beautiful, intuitive designs that enhance user experience and engagement',
        icon: '🎨',
        isActive: true,
        order: 4
      },
      {
        id: 5,
        title: 'API Integration',
        description: 'Seamless integration with third-party services and APIs',
        icon: '🔌',
        isActive: true,
        order: 5
      },
      {
        id: 6,
        title: 'Maintenance & Support',
        description: 'Ongoing support and maintenance to keep your website running smoothly',
        icon: '🛠️',
        isActive: true,
        order: 6
      }
    ];
  }
}