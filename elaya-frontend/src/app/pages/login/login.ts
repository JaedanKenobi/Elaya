// src/app/pages/login/login.ts

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginRequest } from '../../api/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1 class="login-title">CONNEXION</h1>
        <p class="login-subtitle">Accédez à votre espace personnel</p>

        <form (ngSubmit)="login()" #loginForm="ngForm">
          <div class="form-group">
            <label>Email *</label>
            <input 
              type="email" 
              [(ngModel)]="credentials.email" 
              name="email"
              placeholder="votre@email.com"
              required
              class="form-input">
          </div>

          <div class="form-group">
            <label>Mot de passe *</label>
            <input 
              type="password" 
              [(ngModel)]="credentials.password" 
              name="password"
              placeholder="••••••••"
              required
              class="form-input">
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage()" class="error-message">
            {{ errorMessage() }}
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            [disabled]="!loginForm.valid || submitting()"
            class="submit-btn">
            {{ submitting() ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <div class="divider">
          <span>ou</span>
        </div>

        <div class="register-link">
          <p>Pas encore de compte ?</p>
          <a routerLink="/register" class="link">Créer un compte</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      padding: 3rem 2rem;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .login-card {
      width: 100%;
      max-width: 450px;
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      padding: 3rem;
      border: 3px solid #c9984a;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }

    .login-title {
      text-align: center;
      color: #2a2a2a;
      font-size: 2rem;
      font-weight: 300;
      letter-spacing: 0.2em;
      margin-bottom: 0.5rem;
      font-family: Georgia, "Times New Roman", serif;
    }

    .login-subtitle {
      text-align: center;
      color: #6a6a6a;
      font-size: 0.938rem;
      margin-bottom: 2.5rem;
      font-family: Arial, Helvetica, sans-serif;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2a2a2a;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 600;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem;
      border: 2px solid #c9984a;
      background: white;
      font-size: 0.938rem;
      font-family: Arial, Helvetica, sans-serif;
      color: #2a2a2a;
      transition: border-color 0.3s;
    }

    .form-input:focus {
      outline: none;
      border-color: #d4772e;
    }

    .form-input::placeholder {
      color: #b0b0b0;
    }

    .error-message {
      padding: 1rem;
      background: #ffebee;
      color: #c62828;
      border-left: 4px solid #c62828;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
    }

    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: #d4772e;
      color: white;
      border: none;
      font-size: 1rem;
      font-family: Arial, Helvetica, sans-serif;
      cursor: pointer;
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
    }

    .submit-btn:hover:not(:disabled) {
      background: #b86625;
      transform: translateY(-2px);
    }

    .submit-btn:disabled {
      background: #8a8a8a;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .divider {
      text-align: center;
      margin: 2rem 0;
      position: relative;
    }

    .divider::before,
    .divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40%;
      height: 1px;
      background: #d4a574;
    }

    .divider::before {
      left: 0;
    }

    .divider::after {
      right: 0;
    }

    .divider span {
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      padding: 0 1rem;
      color: #6a6a6a;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
    }

    .register-link {
      text-align: center;
    }

    .register-link p {
      color: #4a4a4a;
      font-size: 0.938rem;
      margin-bottom: 0.5rem;
      font-family: Arial, Helvetica, sans-serif;
    }

    .link {
      color: #d4772e;
      text-decoration: none;
      font-size: 1rem;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 600;
      transition: color 0.3s;
    }

    .link:hover {
      color: #b86625;
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .login-container {
        padding: 2rem 1rem;
      }

      .login-card {
        padding: 2rem 1.5rem;
      }

      .login-title {
        font-size: 1.75rem;
      }
    }
  `]
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials: LoginRequest = {
    email: '',
    password: ''
  };

  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  login(): void {
    this.submitting.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Connexion réussie:', response);
        
        // Redirection selon le rôle
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/account']);
        }
      },
      error: (err: Error) => {
        console.error('Erreur connexion:', err);
        this.errorMessage.set(err.message);
        this.submitting.set(false);
      }
    });
  }
}