import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface TermsTranslations {
  title: string;
  lastUpdated: string;
  intro: string;
  acceptance: string;
  acceptanceDesc: string;
  services: string;
  servicesDesc: string;
  userObligations: string;
  userObligationsDesc: string;
  intellectualProperty: string;
  intellectualPropertyDesc: string;
  limitation: string;
  limitationDesc: string;
  termination: string;
  terminationDesc: string;
  changes: string;
  changesDesc: string;
  contact: string;
  contactDesc: string;
}

@Component({
  selector: 'app-terms-of-service',
  imports: [CommonModule],
  templateUrl: './terms-of-service.html',
  styleUrl: './terms-of-service.css'
})
export class TermsOfService implements OnInit {
  currentLang = signal<'en' | 'ar'>('ar');
  
  translations: { en: TermsTranslations; ar: TermsTranslations } = {
    en: {
      title: 'Terms of Service',
      lastUpdated: 'Last Updated: December 2025',
      intro: 'These Terms of Service govern your use of Tevolai\'s website and services. By accessing or using our services, you agree to be bound by these terms.',
      acceptance: 'Acceptance of Terms',
      acceptanceDesc: 'By accessing and using Tevolai\'s services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
      services: 'Description of Services',
      servicesDesc: 'Tevolai provides web development, design, and related technology services. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.',
      userObligations: 'User Obligations',
      userObligationsDesc: 'You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account credentials.',
      intellectualProperty: 'Intellectual Property',
      intellectualPropertyDesc: 'All content, features, and functionality of our services are owned by Tevolai and are protected by international copyright, trademark, and other intellectual property laws.',
      limitation: 'Limitation of Liability',
      limitationDesc: 'Tevolai shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.',
      termination: 'Termination',
      terminationDesc: 'We reserve the right to terminate or suspend your account and access to our services immediately, without prior notice, for any breach of these Terms.',
      changes: 'Changes to Terms',
      changesDesc: 'We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page.',
      contact: 'Contact Information',
      contactDesc: 'If you have any questions about these Terms of Service, please contact us at legal@tevolai.com'
    },
    ar: {
      title: 'شروط الخدمة',
      lastUpdated: 'آخر تحديث: ديسمبر 2025',
      intro: 'تحكم شروط الخدمة هذه استخدامك لموقع تيفولاي وخدماته. من خلال الوصول إلى خدماتنا أو استخدامها، فإنك توافق على الالتزام بهذه الشروط.',
      acceptance: 'قبول الشروط',
      acceptanceDesc: 'من خلال الوصول إلى خدمات تيفولاي واستخدامها، فإنك تقبل وتوافق على الالتزام بشروط وأحكام هذه الاتفاقية. إذا كنت لا توافق على الالتزام بما ورد أعلاه، يرجى عدم استخدام هذه الخدمة.',
      services: 'وصف الخدمات',
      servicesDesc: 'توفر تيفولاي خدمات تطوير الويب والتصميم والتقنيات ذات الصلة. نحتفظ بالحق في تعديل أو تعليق أو إيقاف أي جانب من جوانب خدماتنا في أي وقت.',
      userObligations: 'التزامات المستخدم',
      userObligationsDesc: 'تتفق على استخدام خدماتنا فقط للأغراض القانونية ووفقًا لهذه الشروط. أنت مسؤول عن الحفاظ على سرية بيانات اعتماد حسابك.',
      intellectualProperty: 'الملكية الفكرية',
      intellectualPropertyDesc: 'جميع محتويات وميزات ووظائف خدماتنا مملوكة لتيفولاي ومحمية بموجب قوانين حقوق النشر والعلامات التجارية والملكية الفكرية الدولية الأخرى.',
      limitation: 'تحديد المسؤولية',
      limitationDesc: 'لن تكون تيفولاي مسؤولة عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو عقابية ناتجة عن استخدامك أو عدم قدرتك على استخدام خدماتنا.',
      termination: 'إنهاء الخدمة',
      terminationDesc: 'نحتفظ بالحق في إنهاء أو تعليق حسابك والوصول إلى خدماتنا على الفور، دون إشعار مسبق، لأي انتهاك لهذه الشروط.',
      changes: 'تغييرات الشروط',
      changesDesc: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإخطار المستخدمين بأي تغييرات جوهرية من خلال نشر الشروط الجديدة على هذه الصفحة.',
      contact: 'معلومات الاتصال',
      contactDesc: 'إذا كان لديك أي أسئلة حول شروط الخدمة هذه، يرجى الاتصال بنا على legal@tevolai.com'
    }
  };

  get t(): TermsTranslations {
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

