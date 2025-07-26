import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { environment } from '../../../environments/environment';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RecaptchaModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  constructor(private http: HttpClient, private router: Router) {}

  mode: 'signup' | 'login' = 'signup';
  siteKey = environment.recaptchaSiteKey;

  form = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  loginEmail = '';
  loginPassword = '';

  recaptchaTokens = {
    signup: null as string | null,
    login: null as string | null,
  };

  signupError = '';
  loginError = '';
  signupSuccess = '';
  loginSuccess = '';

  onCaptchaResolved(token: string | null, formType: 'signup' | 'login') {
    this.recaptchaTokens[formType] = token;
  }

  onSignupSubmit() {
    this.signupError = '';
    this.signupSuccess = '';

    if (!this.recaptchaTokens.signup) {
      this.signupError = 'Please complete the reCAPTCHA before signing up.';
      return;
    }

    if (this.form.password !== this.form.confirmPassword) {
      this.signupError = 'Passwords do not match!';
      return;
    }

    this.http.post('http://localhost:5000/signup', {
      ...this.form,
      recaptchaToken: this.recaptchaTokens.signup,
    }).subscribe({
      next: (res: any) => {
        if (res.userId && res.token) {
          localStorage.setItem('userId', res.userId);
          localStorage.setItem('token', res.token);
          this.signupSuccess = 'Signup successful!';
          this.router.navigate(['/preferences']);
        } else {
          console.error('Signup succeeded but missing token or userId:', res);
          this.signupError = 'Signup succeeded but missing token or user ID.';
        }
      },
      error: (err) => {
        console.error('Signup error response:', err);
        this.signupError = err.error?.error || err.message || 'Unknown error';
      },
    });
  }

  onLoginSubmit() {
    this.loginError = '';
    this.loginSuccess = '';

    if (!this.recaptchaTokens.login) {
      this.loginError = 'Please complete the reCAPTCHA before logging in.';
      return;
    }

    this.http.post('http://localhost:5000/login', {
      email: this.loginEmail,
      password: this.loginPassword,
      recaptchaToken: this.recaptchaTokens.login,
    }).subscribe({
      next: (res: any) => {
        if (res.userId && res.token) {
          localStorage.setItem('userId', res.userId);
          localStorage.setItem('token', res.token);
          this.loginSuccess = 'Login successful!';
          this.router.navigate(['/preferences']);
        } else {
          console.error('Login succeeded but missing token or userId:', res);
          this.loginError = 'Login succeeded but missing token or user ID.';
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.loginError = err.error?.error || err.error?.message || 'Unknown error';
      },
    });
  }
}
