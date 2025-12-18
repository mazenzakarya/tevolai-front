import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../Services/AuthService';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isCollapsed = signal(false);

  constructor(private authService: AuthService) {}

  toggleSidebar() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  isAdmin(): boolean {
    return this.authService.hasRole('Admin');
  }
}