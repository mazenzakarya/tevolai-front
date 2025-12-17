import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface AboutTranslations {
  title: string;
  lead: string;
  description1: string;
  description2: string;
  expertTeam: string;
  expertTeamDesc: string;
  qualityFirst: string;
  qualityFirstDesc: string;
  clientFocused: string;
  clientFocusedDesc: string;
  visionText: string;
}

@Component({
  selector: 'app-about-section',
  imports: [CommonModule],
  templateUrl: './about-section.html',
  styleUrl: './about-section.css',
})
export class AboutSection implements OnInit {
  currentLang = signal<'en' | 'ar'>('ar');
  
  translations: { en: AboutTranslations; ar: AboutTranslations } = {
    en: {
      title: 'About Tevolai',
      lead: 'We are a passionate team of developers, designers, and strategists dedicated to transforming your digital vision into reality.',
      description1: 'With years of experience in web development, we specialize in creating custom solutions that drive business growth. From small startups to large enterprises, we\'ve helped hundreds of clients establish a strong online presence.',
      description2: 'Our approach combines cutting-edge technology with user-centered design to deliver websites and applications that not only look great but perform exceptionally.',
      expertTeam: 'Expert Team',
      expertTeamDesc: 'Skilled professionals with years of experience',
      qualityFirst: 'Quality First',
      qualityFirstDesc: 'We never compromise on quality and performance',
      clientFocused: 'Client Focused',
      clientFocusedDesc: 'Your success is our top priority',
      visionText: 'Your Vision, Our Expertise'
    },
    ar: {
      title: 'من نحن',
      lead: 'نحن فريق متحمس من المطورين والمصممين والاستراتيجيين المكرسين لتحويل رؤيتك الرقمية إلى واقع.',
      description1: 'مع سنوات من الخبرة في تطوير الويب، نتخصص في إنشاء حلول مخصصة تدفع نمو الأعمال. من الشركات الناشئة الصغيرة إلى المؤسسات الكبيرة، ساعدنا مئات العملاء في إنشاء وجود قوي على الإنترنت.',
      description2: 'يجمع نهجنا بين أحدث التقنيات والتصميم المتمحور حول المستخدم لتقديم مواقع وتطبيقات لا تبدو رائعة فحسب، بل تؤدي بشكل استثنائي.',
      expertTeam: 'فريق خبير',
      expertTeamDesc: 'محترفون مهرة مع سنوات من الخبرة',
      qualityFirst: 'الجودة أولاً',
      qualityFirstDesc: 'لا نتساوم أبداً على الجودة والأداء',
      clientFocused: 'مركز على العميل',
      clientFocusedDesc: 'نجاحك هو أولويتنا القصوى',
      visionText: 'رؤيتك، خبرتنا'
    }
  };

  get t(): AboutTranslations {
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