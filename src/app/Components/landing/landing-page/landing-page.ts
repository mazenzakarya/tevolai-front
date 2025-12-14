import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FirstBriefSection } from '../first-brief-section/first-brief-section';
import { ServicesOnMain } from '../services-on-main/services-on-main';
import { AboutSection } from '../about-section/about-section';
import { TechSection } from '../tech-section/tech-section';

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, RouterLink, FirstBriefSection, ServicesOnMain, AboutSection, TechSection],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage implements OnInit {
  ngOnInit() {}
}