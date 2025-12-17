import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

interface FooterTranslations {
  tagline: string;
  quickLinks: string;
  services: string;
  contact: string;
  home: string;
  servicesLink: string;
  about: string;
  contactLink: string;
  webDev: string;
  wordpress: string;
  ecommerce: string;
  uiux: string;
  privacy: string;
  terms: string;
  rights: string;
}

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {
  currentYear = new Date().getFullYear();
  currentLang = signal<'en' | 'ar'>('ar');
  
  translations: { en: FooterTranslations; ar: FooterTranslations } = {
    en: {
      tagline: 'Building exceptional web solutions for businesses worldwide. Your success is our mission.',
      quickLinks: 'Quick Links',
      services: 'Services',
      contact: 'Contact',
      home: 'Home',
      servicesLink: 'Services',
      about: 'About',
      contactLink: 'Contact',
      webDev: 'Web Development',
      wordpress: 'WordPress',
      ecommerce: 'E-Commerce',
      uiux: 'UI/UX Design',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      rights: 'All rights reserved.'
    },
    ar: {
      tagline: 'بناء حلول ويب استثنائية للشركات في جميع أنحاء العالم. نجاحك هو مهمتنا.',
      quickLinks: 'روابط سريعة',
      services: 'الخدمات',
      contact: 'اتصل بنا',
      home: 'الرئيسية',
      servicesLink: 'الخدمات',
      about: 'من نحن',
      contactLink: 'اتصل بنا',
      webDev: 'تطوير الويب',
      wordpress: 'ووردبريس',
      ecommerce: 'التجارة الإلكترونية',
      uiux: 'تصميم واجهة المستخدم',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      rights: 'جميع الحقوق محفوظة.'
    }
  };

  get t(): FooterTranslations {
    return this.translations[this.currentLang()];
  }

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.updateLanguageFromRoute();
    });
  }

  ngOnInit() {
    this.updateLanguageFromRoute();
  }

  private updateLanguageFromRoute() {
    const url = this.router.url;
    if (url.startsWith('/ar')) {
      this.currentLang.set('ar');
    } else {
      this.currentLang.set('en');
    }
  }
}