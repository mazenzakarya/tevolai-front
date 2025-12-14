import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tech-section',
  imports: [CommonModule],
  templateUrl: './tech-section.html',
  styleUrl: './tech-section.css',
})
export class TechSection {
  technologies = [
    { name: 'Angular', icon: '🅰️', description: 'Modern frontend framework' },
    { name: '.NET', icon: '⚙️', description: 'Robust backend solutions' },
    { name: 'WordPress', icon: '📝', description: 'Content management' },
    { name: 'TypeScript', icon: '📘', description: 'Type-safe development' },
    { name: 'Node.js', icon: '🟢', description: 'Server-side JavaScript' },
    { name: 'MongoDB', icon: '🍃', description: 'NoSQL database' },
    { name: 'PostgreSQL', icon: '🐘', description: 'Relational database' },
    { name: 'Docker', icon: '🐳', description: 'Containerization' },
    { name: 'AWS', icon: '☁️', description: 'Cloud infrastructure' },
  ];
}