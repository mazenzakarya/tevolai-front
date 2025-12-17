import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicesOnMainService } from '../../../Services/ServicesOnMainService';
import { ServicesOnMainDto, Language } from '../../../models/services.models';

@Component({
  selector: 'app-services-on-main',
  imports: [CommonModule],
  templateUrl: './services-on-main.html',
  styleUrl: './services-on-main.css',
})
export class ServicesOnMain implements OnInit {
  services = signal<ServicesOnMainDto[]>([]);
  isLoading = signal(true);
  currentLanguage = signal<'en' | 'ar'>('ar');

  constructor(
    private servicesOnMainService: ServicesOnMainService,
    private router: Router
  ) {
    this.router.events.subscribe(() => {
      this.updateLanguageFromRoute();
    });
  }

  ngOnInit() {
    this.updateLanguageFromRoute();
  }

  private updateLanguageFromRoute() {
    const url = this.router.url;
    const lang = url.startsWith('/ar') ? 'ar' : 'en';
    this.currentLanguage.set(lang);
    this.loadServices();
  }

  loadServices() {
    this.isLoading.set(true);
    const language = this.currentLanguage() === 'ar' ? Language.Arabic : Language.English;
    
    this.servicesOnMainService.getServicesByLanguage(language).subscribe({
      next: (data) => {
        // Handle null/undefined or empty array
        if (!data || !Array.isArray(data) || data.length === 0) {
          this.services.set([]);
          this.isLoading.set(false);
          return;
        }
        
        // Filter active services - show all services returned by backend
        // Backend should filter by language, but we'll show whatever it returns
        const filteredServices = data.filter(s => {
          if (!s) return false;
          const isActive = s.isActive !== false;
          const notDeleted = !s.isDeleted;
          return isActive && notDeleted;
        });
        
        this.services.set(filteredServices);
        this.isLoading.set(false);
      },
      error: () => {
        this.services.set([]);
        this.isLoading.set(false);
      }
    });
  }
}