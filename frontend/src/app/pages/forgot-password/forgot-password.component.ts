import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule], // Only necessary imports
  templateUrl: './forgot-password.component.html', // Make sure this path is correct
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  // Properly initialized properties
  email: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null; // Explicit null type
  successMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    console.log('Component initialized'); // Debug log
  }

  onSubmit(): void {
    console.log('Form submitted'); // Debug log
    
    // 1. Validate input
    if (!this.email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    // 2. Reset messages
    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;

    // 3. Make HTTP request
    this.http.post(`${environment.apiUrlNode}/forgot-password`, { 
      email: this.email 
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Reset link sent successfully!';
        console.log('Request succeeded'); // Debug log
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to send reset link';
        console.error('Request failed:', err); // Debug log
      }
    });
  }
}