import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../Services/AuthService';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  isMenuOpen = signal(false);
  isAuthenticated = signal(false);

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.isAuthenticated.set(this.authService.isAuthenticated());
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  logout() {
    this.authService.logout();
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }
}