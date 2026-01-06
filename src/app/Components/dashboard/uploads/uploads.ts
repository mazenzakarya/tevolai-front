import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService, UploadResponse } from '../../../Services/UploadService';

@Component({
  selector: 'app-uploads',
  imports: [CommonModule],
  templateUrl: './uploads.html',
  styleUrl: './uploads.css',
})
export class UploadsComponent implements OnInit {
  uploads = signal<UploadResponse[]>([]);
  isLoading = signal(true);
  uploading = signal(false);
  dragover = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(private uploadService: UploadService) {}

  ngOnInit() {
    this.loadUploads();
  }

  loadUploads() {
    this.isLoading.set(true);
    this.uploadService.getAllUploads().subscribe({
      next: (data) => {
        this.uploads.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Failed to load uploads');
        this.isLoading.set(false);
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.uploadFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragover.set(true);
  }

  onDragLeave() {
    this.dragover.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragover.set(false);
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.uploadFile(event.dataTransfer.files[0]);
    }
  }

  uploadFile(file: File) {
    // Validate file type
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      this.errorMessage.set('File type not allowed. Allowed types: JPG, PNG, WebP, PDF');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorMessage.set('File size exceeds limit (5MB)');
      return;
    }

    this.uploading.set(true);
    this.errorMessage.set(null);

    this.uploadService.uploadFile(file).subscribe({
      next: (response) => {
        this.successMessage.set(`File "${file.name}" uploaded successfully`);
        this.uploads.update((uploads) => [...uploads, response]);
        this.uploading.set(false);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Upload failed');
        this.uploading.set(false);
      },
    });
  }

  deleteUpload(fileName: string) {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    this.uploadService.deleteUpload(fileName).subscribe({
      next: () => {
        this.uploads.update((uploads) => uploads.filter((u) => u.name !== fileName));
        this.successMessage.set(`File "${fileName}" deleted successfully`);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (error) => {
        this.errorMessage.set('Failed to delete file');
      },
    });
  }

  copyToClipboard(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      this.successMessage.set('URL copied to clipboard');
      setTimeout(() => this.successMessage.set(null), 2000);
    });
  }

  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return '📄';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'webp':
        return '🖼️';
      default:
        return '📁';
    }
  }
}
