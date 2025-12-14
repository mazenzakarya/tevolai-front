import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactMessageService } from '../../../Services/ContactMessageService';
import { ContactMessageDto } from '../../../models/contact-message.models';

@Component({
  selector: 'app-contact-messages',
  imports: [CommonModule],
  templateUrl: './contact-messages.html',
  styleUrl: './contact-messages.css'
})
export class ContactMessages implements OnInit {
  messages = signal<ContactMessageDto[]>([]);
  isLoading = signal(true);
  selectedMessage = signal<ContactMessageDto | null>(null);
  filterRead = signal<boolean | null>(null);

  constructor(private contactMessageService: ContactMessageService) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.isLoading.set(true);
    if (this.filterRead() !== null) {
      this.contactMessageService.getContactMessagesByReadStatus(this.filterRead()!).subscribe({
        next: (data) => {
          this.messages.set(data);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    } else {
      this.contactMessageService.getPagedContactMessages(1, 100).subscribe({
        next: (data) => {
          this.messages.set(data.items);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }

  viewMessage(message: ContactMessageDto) {
    this.selectedMessage.set(message);
    if (!message.isRead) {
      this.markAsRead(message.id!);
    }
  }

  markAsRead(id: number) {
    this.contactMessageService.markAsRead(id).subscribe({
      next: () => {
        this.messages.update(msgs => 
          msgs.map(msg => msg.id === id ? { ...msg, isRead: true } : msg)
        );
        if (this.selectedMessage()?.id === id) {
          this.selectedMessage.update(msg => msg ? { ...msg, isRead: true } : null);
        }
      }
    });
  }

  deleteMessage(id: number) {
    if (confirm('Are you sure you want to delete this message?')) {
      this.contactMessageService.deleteContactMessage(id).subscribe({
        next: () => {
          this.messages.update(msgs => msgs.filter(msg => msg.id !== id));
          if (this.selectedMessage()?.id === id) {
            this.selectedMessage.set(null);
          }
        }
      });
    }
  }

  filterMessages(readStatus: boolean | null) {
    this.filterRead.set(readStatus);
    this.loadMessages();
  }

  closeMessage() {
    this.selectedMessage.set(null);
  }
}
