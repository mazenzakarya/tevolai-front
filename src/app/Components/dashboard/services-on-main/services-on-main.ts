import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ServicesOnMainService } from '../../../Services/ServicesOnMainService';
import { UploadService } from '../../../Services/UploadService';
import { ServicesOnMainDto, Language } from '../../../models/services.models';
import { environment } from '../../../../environments';

@Component({
  selector: 'app-services-on-main',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './services-on-main.html',
  styleUrl: './services-on-main.css',
})
export class ServicesOnMainManagement implements OnInit {
  services = signal<ServicesOnMainDto[]>([]);
  isLoading = signal(true);
  showForm = signal(false);
  editingService = signal<ServicesOnMainDto | null>(null);
  serviceForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);
  uploading = signal(false);

  constructor(
    private servicesOnMainService: ServicesOnMainService,
    private uploadService: UploadService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.serviceForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.min(0)]],
      imageUrl: [''],
      category: [''],
      language: [Language.English, [Validators.required]],
      isActive: [true],
    });
  }

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.isLoading.set(true);
    this.servicesOnMainService.getAllServices().subscribe({
      next: (data) => {
        this.services.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  openAddForm() {
    this.editingService.set(null);
    this.selectedFile = null;
    this.imagePreview.set(null);
    this.serviceForm.reset({
      isActive: true,
      price: 0,
      language: Language.English,
    });
    this.showForm.set(true);
  }

  openEditForm(service: ServicesOnMainDto) {
    this.editingService.set(service);
    this.imagePreview.set(service.imageUrl || null);
    this.serviceForm.patchValue({
      title: service.title,
      description: service.description,
      price: service.price || 0,
      imageUrl: service.imageUrl || '',
      category: service.category || '',
      language: service.language ?? Language.English,
      isActive: service.isActive !== false,
    });
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingService.set(null);
    this.serviceForm.reset();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview.set(e.target.result);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async uploadImage(): Promise<string | null> {
    if (!this.selectedFile) {
      return this.serviceForm.value.imageUrl || null;
    }

    this.uploading.set(true);

    try {
      const response = await this.uploadService.uploadFile(this.selectedFile).toPromise();
      this.uploading.set(false);
      return response?.url || null;
    } catch (error) {
      this.uploading.set(false);
      // Fallback: use existing URL or base64
      return this.serviceForm.value.imageUrl || null;
    }
  }

  async onSubmit() {
    if (this.serviceForm.valid) {
      let imageUrl = this.serviceForm.value.imageUrl;

      // Upload image if a new file is selected
      if (this.selectedFile) {
        const uploadedUrl = await this.uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      // Prepare service data with proper types
      const formValue = this.serviceForm.value;

      // Ensure language is properly converted to number
      let languageValue = Language.English;
      if (formValue.language !== undefined && formValue.language !== null) {
        languageValue = Number(formValue.language);
        // Validate language value
        if (languageValue !== Language.English && languageValue !== Language.Arabic) {
          languageValue = Language.English;
        }
      }

      const serviceData: ServicesOnMainDto = {
        title: formValue.title?.trim() || '',
        description: formValue.description?.trim() || '',
        price: formValue.price ? Number(formValue.price) : undefined,
        imageUrl: imageUrl?.trim() || undefined,
        category: formValue.category?.trim() || undefined,
        isActive: formValue.isActive !== false,
        language: languageValue,
      };

      if (this.editingService()) {
        // Include id for update
        serviceData.id = this.editingService()!.id;
        this.servicesOnMainService.updateService(serviceData).subscribe({
          next: () => {
            this.loadServices();
            this.closeForm();
          },
          error: () => {
            alert('Failed to update service. Please try again.');
          },
        });
      } else {
        // Don't include id for new service
        this.servicesOnMainService.addService(serviceData).subscribe({
          next: () => {
            this.loadServices();
            this.closeForm();
          },
          error: () => {
            alert('Failed to add service. Please try again.');
          },
        });
      }
    }
  }

  deleteService(id: number) {
    if (confirm('Are you sure you want to delete this service?')) {
      this.servicesOnMainService.deleteService(id).subscribe({
        next: () => this.loadServices(),
      });
    }
  }
}
