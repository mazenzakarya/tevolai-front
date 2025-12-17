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
    { name: 'Angular', icon: '🅰️', description: 'Modern frontend framework', category: 'Frontend' },
    { name: '.NET', icon: '⚙️', description: 'Robust backend solutions', category: 'Backend' },
    { name: 'WordPress', icon: '📝', description: 'Content management', category: 'CMS' },
    { name: 'TypeScript', icon: '📘', description: 'Type-safe development', category: 'Language' },
    { name: 'Node.js', icon: '🟢', description: 'Server-side JavaScript', category: 'Runtime' },
    { name: 'MongoDB', icon: '🍃', description: 'NoSQL database', category: 'Database' },
    { name: 'PostgreSQL', icon: '🐘', description: 'Relational database', category: 'Database' },
    { name: 'Docker', icon: '🐳', description: 'Containerization', category: 'DevOps' },
    { name: 'AWS', icon: '☁️', description: 'Cloud infrastructure', category: 'Cloud' },
  ];
}