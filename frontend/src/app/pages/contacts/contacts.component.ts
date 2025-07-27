import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- removed HttpClientModule here
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactComponent {
  contact = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  responseMessage = '';

  constructor(private http: HttpClient) {}

  submitForm() {
    this.http.post('http://localhost:5000/enquiry', this.contact).subscribe({
      next: (res: any) => {
        this.responseMessage = 'Message sent successfully!';
        this.contact = { name: '', email: '', phone: '', subject: '', message: '' };
      },
      error: () => {
        this.responseMessage = 'Failed to send message. Please try again later.';
      }
    });
  }
}
