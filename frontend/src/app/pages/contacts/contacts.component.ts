import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { environment } from '../../../environments/environment'; 

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // HttpClientModule is required here
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

  constructor(private http: HttpClient) { }

  submitForm() {
    const enquiryUrl = `${environment.apiUrlNode}/enquiry`; // Use environment URL

    this.http.post(enquiryUrl, this.contact).subscribe({
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
