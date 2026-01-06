import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
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
  private pendingSection: string | null = null;

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

  constructor(private router: Router, private authService: AuthService) {
    this.isAuthenticated.set(this.authService.isAuthenticated());

    // Listen to route changes
    this.router.events.subscribe((event) => {
      this.updateLanguageFromRoute();
      if (event instanceof NavigationEnd && this.pendingSection) {
        this.scrollToSection(this.pendingSection);
        this.pendingSection = null;
      }
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

  closeMenu() {
    this.isMenuOpen.set(false);
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
    this.closeMenu();
  }

  navigateToSection(sectionId: string, event?: Event) {
    event?.preventDefault();
    const targetSection = sectionId === 'home' ? 'top' : sectionId;
    const url = this.router.url;
    const onLanding = url === '/' || url === '' || url === '/ar';

    if (onLanding) {
      this.scrollToSection(targetSection);
    } else {
      this.pendingSection = targetSection;
      const landingRoute = this.currentLang() === 'ar' ? '/ar' : '/';
      this.router.navigateByUrl(landingRoute);
    }

    this.closeMenu();
  }

  private scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  logout() {
    this.authService.logout();
    this.isAuthenticated.set(false);
    this.closeMenu();
    const lang = this.currentLang() === 'ar' ? '/ar' : '';
    this.router.navigate([lang || '/']);
  }
}
