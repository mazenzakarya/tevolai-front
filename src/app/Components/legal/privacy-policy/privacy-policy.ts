import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface PrivacyTranslations {
  title: string;
  lastUpdated: string;
  intro: string;
  dataCollection: string;
  dataCollectionDesc: string;
  dataUsage: string;
  dataUsageDesc: string;
  dataProtection: string;
  dataProtectionDesc: string;
  cookies: string;
  cookiesDesc: string;
  rights: string;
  rightsDesc: string;
  contact: string;
  contactDesc: string;
}

@Component({
  selector: 'app-privacy-policy',
  imports: [CommonModule],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.css'
})
export class PrivacyPolicy implements OnInit {
  currentLang = signal<'en' | 'ar'>('ar');
  
  translations: { en: PrivacyTranslations; ar: PrivacyTranslations } = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: December 2025',
      intro: 'At Tevolai, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our services.',
      dataCollection: 'Information We Collect',
      dataCollectionDesc: 'We collect information that you provide directly to us, such as when you create an account, contact us, or use our services. This may include your name, email address, phone number, and other contact information.',
      dataUsage: 'How We Use Your Information',
      dataUsageDesc: 'We use the information we collect to provide, maintain, and improve our services, process transactions, communicate with you, and comply with legal obligations.',
      dataProtection: 'Data Protection',
      dataProtectionDesc: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
      cookies: 'Cookies and Tracking',
      cookiesDesc: 'We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.',
      rights: 'Your Rights',
      rightsDesc: 'You have the right to access, update, or delete your personal information at any time. You may also opt-out of certain communications from us.',
      contact: 'Contact Us',
      contactDesc: 'If you have any questions about this Privacy Policy, please contact us at privacy@tevolai.com'
    },
    ar: {
      title: 'سياسة الخصوصية',
      lastUpdated: 'آخر تحديث: ديسمبر 2025',
      intro: 'في تيفولاي، نحن ملتزمون بحماية خصوصيتك. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام خدماتنا.',
      dataCollection: 'المعلومات التي نجمعها',
      dataCollectionDesc: 'نجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب أو الاتصال بنا أو استخدام خدماتنا. قد يشمل ذلك اسمك وعنوان بريدك الإلكتروني ورقم هاتفك ومعلومات الاتصال الأخرى.',
      dataUsage: 'كيف نستخدم معلوماتك',
      dataUsageDesc: 'نستخدم المعلومات التي نجمعها لتقديم خدماتنا وصيانتها وتحسينها، ومعالجة المعاملات، والتواصل معك، والامتثال للالتزامات القانونية.',
      dataProtection: 'حماية البيانات',
      dataProtectionDesc: 'نطبق التدابير التقنية والتنظيمية المناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الكشف أو التدمير.',
      cookies: 'ملفات تعريف الارتباط والتتبع',
      cookiesDesc: 'نستخدم ملفات تعريف الارتباط وتقنيات التتبع المماثلة لتتبع النشاط على موقعنا الإلكتروني والاحتفاظ بمعلومات معينة. يمكنك توجيه متصفحك لرفض جميع ملفات تعريف الارتباط أو الإشارة عند إرسال ملف تعريف ارتباط.',
      rights: 'حقوقك',
      rightsDesc: 'لديك الحق في الوصول إلى معلوماتك الشخصية أو تحديثها أو حذفها في أي وقت. يمكنك أيضًا إلغاء الاشتراك في بعض الاتصالات منا.',
      contact: 'اتصل بنا',
      contactDesc: 'إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على privacy@tevolai.com'
    }
  };

  get t(): PrivacyTranslations {
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

