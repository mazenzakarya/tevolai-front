import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../Services/AuthService';

interface NavTranslations {
  home: string;
  services: string;
  about: string;
  blog: string;
  contact: string;
  dashboard: string;
  login: string;
  logout: string;
  getStarted: string;
}

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isMenuOpen = signal(false);
  isAuthenticated = signal(false);
  currentLang = signal<'en' | 'ar'>('ar');

  translations: { en: NavTranslations; ar: NavTranslations } = {
    en: {
      home: 'Home',
      services: 'Services',
      about: 'About',
      blog: 'Blog',
      contact: 'Contact',
      dashboard: 'Dashboard',
      login: 'Login',
      logout: 'Logout',
      getStarted: 'Get Started',
    },
    ar: {
      home: 'الرئيسية',
      services: 'الخدمات',
      about: 'من نحن',
      blog: 'المدونة',
      contact: 'اتصل بنا',
      dashboard: 'لوحة التحكم',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      getStarted: 'ابدأ الآن',
    },
  };

  get t(): NavTranslations {
    return this.translations[this.currentLang()];
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.isAuthenticated.set(this.authService.isAuthenticated());

    // Listen to route changes
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
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      this.currentLang.set('en');
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  toggleLanguage() {
    const currentUrl = this.router.url;
    const newLang = this.currentLang() === 'ar' ? 'en' : 'ar';

    let newUrl = currentUrl;
    if (newLang === 'ar') {
      // Switch to Arabic route
      if (currentUrl === '/' || currentUrl === '') {
        newUrl = '/ar';
      } else if (!currentUrl.startsWith('/ar')) {
        newUrl = '/ar' + currentUrl;
      }
    } else {
      // Switch to English route
      if (currentUrl.startsWith('/ar')) {
        newUrl = currentUrl.replace('/ar', '') || '/';
      }
    }

    this.router.navigateByUrl(newUrl);
  }

  logout() {
    this.authService.logout();
    this.isAuthenticated.set(false);
    const lang = this.currentLang() === 'ar' ? '/ar' : '';
    this.router.navigate([lang || '/']);
  }
}
