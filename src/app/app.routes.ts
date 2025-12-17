import { Routes } from '@angular/router';
import { DashboardPage } from './Components/dashboard/dashboard-page/dashboard-page';
import { LandingPage } from './Components/landing/landing-page/landing-page';
import { Login } from './Components/auth/login/login';
import { Register } from './Components/auth/register/register';
import { ContactPage } from './Components/contact/contact-page/contact-page';
import { Customer } from './Components/dashboard/customer/customer';
import { ServiceList } from './Components/dashboard/service-list/service-list';
import { Reveneu } from './Components/dashboard/reveneu/reveneu';
import { Expense } from './Components/dashboard/expense/expense';
import { ContactMessages } from './Components/dashboard/contact-messages/contact-messages';
import { EmailCredentials } from './Components/dashboard/email-credentials/email-credentials';
import { ServicesOnMainManagement } from './Components/dashboard/services-on-main/services-on-main';
import { PrivacyPolicy } from './Components/legal/privacy-policy/privacy-policy';
import { TermsOfService } from './Components/legal/terms-of-service/terms-of-service';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // English routes
  {
    path: '',
    component: LandingPage,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'contact',
    component: ContactPage,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicy,
  },
  {
    path: 'terms-of-service',
    component: TermsOfService,
  },
  // Arabic routes (/ar)
  {
    path: 'ar',
    component: LandingPage,
  },
  {
    path: 'ar/login',
    component: Login,
  },
  {
    path: 'ar/register',
    component: Register,
  },
  {
    path: 'ar/contact',
    component: ContactPage,
  },
  {
    path: 'ar/privacy-policy',
    component: PrivacyPolicy,
  },
  {
    path: 'ar/terms-of-service',
    component: TermsOfService,
  },
  // Dashboard (language independent)
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'customers',
        pathMatch: 'full',
      },
      {
        path: 'customers',
        component: Customer,
      },
      {
        path: 'services',
        component: ServiceList,
      },
      {
        path: 'revenue',
        component: Reveneu,
      },
      {
        path: 'expenses',
        component: Expense,
      },
      {
        path: 'contact-messages',
        component: ContactMessages,
      },
      {
        path: 'email-credentials',
        component: EmailCredentials,
      },
      {
        path: 'services-on-main',
        component: ServicesOnMainManagement,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
