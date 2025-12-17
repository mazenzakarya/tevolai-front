import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateMetaTag(name: string, content: string) {
    this.meta.updateTag({ name, content });
  }

  updateOgTag(property: string, content: string) {
    this.meta.updateTag({ property, content });
  }

  setDashboardNoIndex() {
    // Prevent dashboard pages from being indexed
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    this.meta.updateTag({ name: 'googlebot', content: 'noindex, nofollow' });
  }

  setPublicIndex() {
    // Allow public pages to be indexed
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });
    this.meta.removeTag('name="googlebot"');
  }

  setLandingPageMeta(lang: 'ar' | 'en' = 'ar') {
    if (lang === 'ar') {
      this.updateTitle('تيفولاي - بناء مواقع الويب للعيادات والأطباء والمعلمين | Tevolai');
      this.updateMetaTag('description', 'تيفولاي - شركة متخصصة في بناء وتطوير مواقع الويب للعيادات الطبية والأطباء والمعلمين في الشرق الأوسط. نقدم حلول ويب احترافية بتقنيات حديثة.');
      this.updateMetaTag('keywords', 'بناء مواقع ويب, تطوير مواقع, مواقع للعيادات, مواقع للأطباء, مواقع للمعلمين, تطوير ويب الشرق الأوسط, web development, clinic websites, doctor websites, teacher websites');
    } else {
      this.updateTitle('Tevolai - Web Development for Clinics, Doctors & Teachers | تيفولاي');
      this.updateMetaTag('description', 'Tevolai - Professional web development services for clinics, doctors, and teachers in the Middle East. We provide modern web solutions using cutting-edge technologies.');
      this.updateMetaTag('keywords', 'web development, clinic websites, doctor websites, teacher websites, Middle East web development, Angular, .NET, WordPress, بناء مواقع ويب');
    }
    this.setPublicIndex();
  }
}

