import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./Components/shared/footer/footer";
import { Navbar } from "./Components/shared/navbar/navbar";
import { ServicesOnMain } from "./Components/landing/services-on-main/services-on-main";
import { Sidebar } from "./Components/shared/sidebar/sidebar";
import { Reveneu } from "./Components/dashboard/reveneu/reveneu";

@Component({
  selector: 'app-root',
  imports: [Footer, Navbar, ServicesOnMain, Sidebar, RouterOutlet, Reveneu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tevolai');
}
