import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ServicesOnMain } from '../services-on-main/services-on-main';
import { AboutSection } from '../about-section/about-section';
import { TechSection } from '../tech-section/tech-section';
import { SeoService } from '../../../Services/SeoService';

interface Translations {
  heroTitle: string;
  heroTitleHighlight: string;
  heroDescription: string;
  getStarted: string;
  ourServices: string;
  projectsDelivered: string;
  clientSatisfaction: string;
  supportAvailable: string;
  readyToStart: string;
  letsDiscuss: string;
  contactUs: string;
}

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, RouterLink, ServicesOnMain, AboutSection, TechSection],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage implements OnInit {
  currentLang = signal<'en' | 'ar'>('ar');
  
  constructor(
    private seoService: SeoService,
    private router: Router
  ) {}
  
  translations: { en: Translations; ar: Translations } = {
    en: {
      heroTitle: 'Build Your Digital Future with',
      heroTitleHighlight: 'Tevolai',
      heroDescription: 'We transform your ideas into powerful web solutions. From custom websites to enterprise applications, we deliver excellence that drives your business forward.',
      getStarted: 'Get Started Free',
      ourServices: 'Our Services',
      projectsDelivered: 'Projects Delivered',
      clientSatisfaction: 'Client Satisfaction',
      supportAvailable: 'Support Available',
      readyToStart: 'Ready to Start Your Project?',
      letsDiscuss: 'Let\'s discuss how we can help bring your vision to life',
      contactUs: 'Contact Us'
    },
    ar: {
      heroTitle: 'ابني مستقبلك الرقمي مع',
      heroTitleHighlight: 'تيفولاي',
      heroDescription: 'نحول أفكارك إلى حلول ويب قوية. من المواقع المخصصة إلى التطبيقات المؤسسية، نقدم التميز الذي يدفع عملك إلى الأمام. متخصصون في تقديم الخدمات للمدرسين والأطباء والمتاجر الإلكترونية',
      getStarted: 'ابدأ مجاناً',
      ourServices: 'خدماتنا',
      projectsDelivered: 'مشروع تم تسليمه',
      clientSatisfaction: 'رضا العملاء',
      supportAvailable: 'دعم متاح',
      readyToStart: 'هل أنت مستعد لبدء مشروعك؟',
      letsDiscuss: 'دعنا نناقش كيف يمكننا المساعدة في جلب رؤيتك إلى الحياة',
      contactUs: 'اتصل بنا'
    }
  };

  get t(): Translations {
    return this.translations[this.currentLang()];
  }

  toggleLanguage(): void {
    const newLang = this.currentLang() === 'en' ? 'ar' : 'en';
    const currentUrl = this.router.url;
    
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

  ngOnInit() {
    // Set SEO for public landing page
    this.seoService.setPublicIndex();
    
    // Detect language from route
    const url = this.router.url;
    const lang = url.startsWith('/ar') ? 'ar' : 'en';
    this.currentLang.set(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('preferredLanguage', lang);
    this.seoService.setLandingPageMeta(lang);
  }
}