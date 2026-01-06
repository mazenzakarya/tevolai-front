import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactMessageService } from '../../../Services/ContactMessageService';
import { Router } from '@angular/router';

interface ContactTranslations {
  title: string;
  subtitle: string;
  emailUs: string;
  callUs: string;
  whatsappUs: string;
  availability: string;
  sendMessage: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  sendButton: string;
  sending: string;
  nameRequired: string;
  emailInvalid: string;
  subjectRequired: string;
  messageMinLength: string;
  successMessage: string;
  errorMessage: string;
}

@Component({
  selector: 'app-contact-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
})
export class ContactPage implements OnInit {
  contactForm: FormGroup;
  isLoading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  currentLang = signal<'en' | 'ar'>('ar');
  phoneNumber = '+20 1035466843';
  whatsappNumber = '201035466843';

  translations: { en: ContactTranslations; ar: ContactTranslations } = {
    en: {
      title: 'Get In Touch',
      subtitle:
        "Have a project in mind? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      emailUs: 'Email Us',
      callUs: 'Call Us',
      whatsappUs: 'WhatsApp Us',
      availability: 'Mon - Fri, 9am - 6pm',
      sendMessage: 'Send us a Message',
      nameLabel: 'Your Name',
      namePlaceholder: 'John Doe',
      emailLabel: 'Your Email',
      emailPlaceholder: 'john@example.com',
      subjectLabel: 'Subject',
      subjectPlaceholder: 'Project Inquiry',
      messageLabel: 'Message',
      messagePlaceholder: 'Tell us about your project...',
      sendButton: 'Send Message',
      sending: 'Sending...',
      nameRequired: 'Name is required',
      emailInvalid: 'Please enter a valid email address',
      subjectRequired: 'Subject is required',
      messageMinLength: 'Message must be at least 10 characters',
      successMessage: 'Thank you! Your message has been sent successfully.',
      errorMessage: 'Failed to send message. Please try again.',
    },
    ar: {
      title: 'تواصل معنا',
      subtitle:
        'هل لديك مشروع في ذهنك؟ نحن نحب أن نسمع منك. أرسل لنا رسالة وسوف نرد في أقرب وقت ممكن.',
      emailUs: 'راسلنا',
      callUs: 'اتصل بنا',
      whatsappUs: 'واتساب',
      availability: 'الإثنين - الجمعة، 9 صباحاً - 6 مساءً',
      sendMessage: 'أرسل لنا رسالة',
      nameLabel: 'الاسم',
      namePlaceholder: 'أحمد محمد',
      emailLabel: 'البريد الإلكتروني',
      emailPlaceholder: 'ahmed@example.com',
      subjectLabel: 'الموضوع',
      subjectPlaceholder: 'استفسار عن مشروع',
      messageLabel: 'الرسالة',
      messagePlaceholder: 'أخبرنا عن مشروعك...',
      sendButton: 'إرسال الرسالة',
      sending: 'جاري الإرسال...',
      nameRequired: 'الاسم مطلوب',
      emailInvalid: 'الرجاء إدخال بريد إلكتروني صحيح',
      subjectRequired: 'الموضوع مطلوب',
      messageMinLength: 'يجب أن تكون الرسالة 10 أحرف على الأقل',
      successMessage: 'شكراً لك! تم إرسال رسالتك بنجاح.',
      errorMessage: 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.',
    },
  };

  constructor(
    private fb: FormBuilder,
    private contactMessageService: ContactMessageService,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {
    const url = this.router.url;
    if (url.includes('/ar/')) {
      this.currentLang.set('ar');
    } else {
      this.currentLang.set('en');
    }
  }

  get t() {
    return this.translations[this.currentLang()];
  }

  openWhatsApp() {
    window.open(`https://wa.me/${this.whatsappNumber}`, '_blank');
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      this.contactMessageService.addContactMessage(this.contactForm.value).subscribe({
        next: () => {
          this.successMessage.set(this.t.successMessage);
          this.contactForm.reset();
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || this.t.errorMessage);
          this.isLoading.set(false);
        },
      });
    }
  }
}
