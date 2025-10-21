// src/app/pages/register/register.ts

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../../api/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h1 class="register-title">INSCRIPTION</h1>
        <p class="register-subtitle">Créez votre compte client</p>

        <form (ngSubmit)="register()" #registerForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label>Prénom *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.prenom" 
                name="prenom"
                required
                class="form-input">
            </div>

            <div class="form-group">
              <label>Nom *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.nom" 
                name="nom"
                required
                class="form-input">
            </div>
          </div>

          <div class="form-group">
            <label>Email *</label>
            <input 
              type="email" 
              [(ngModel)]="formData.email" 
              name="email"
              placeholder="votre@email.com"
              required
              class="form-input">
          </div>

          <div class="form-group">
            <label>Téléphone</label>
            <input 
              type="tel" 
              [(ngModel)]="formData.telephone" 
              name="telephone"
              placeholder="06 12 34 56 78"
              class="form-input">
          </div>

          <div class="form-group">
            <label>Mot de passe *</label>
            <input 
              type="password" 
              [(ngModel)]="formData.password" 
              name="password"
              placeholder="••••••••"
              required
              minlength="8"
              class="form-input">
            <small class="hint">Minimum 8 caractères</small>
          </div>

          <div class="form-group">
            <label>Confirmer le mot de passe *</label>
            <input 
              type="password" 
              [(ngModel)]="formData.password_confirmation" 
              name="password_confirmation"
              placeholder="••••••••"
              required
              class="form-input">
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage()" class="error-message">
            {{ errorMessage() }}
          </div>

          <!-- Password Mismatch Warning -->
          <div *ngIf="formData.password && formData.password_confirmation && formData.password !== formData.password_confirmation" class="warning-message">
            Les mots de passe ne correspondent pas
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            [disabled]="!registerForm.valid || formData.password !== formData.password_confirmation || submitting()"
            class="submit-btn">
            {{ submitting() ? 'Inscription...' : "S'inscrire" }}
          </button>
        </form>

        <div class="divider">
          <span>ou</span>
        </div>

        <div class="login-link">
          <p>Vous avez déjà un compte ?</p>
          <a routerLink="/login" class="link">Se connecter</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      padding: 3rem 2rem;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .register-card {
      width: 100%;
      max-width: 550px;
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      padding: 3rem;
      border: 3px solid #c9984a;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }

    .register-title {
      text-align: center;
      color: #2a2a2a;
      font-size: 2rem;
      font-weight: 300;
      letter-spacing: 0.2em;
      margin-bottom: 0.5rem;
      font-family: Georgia, "Times New Roman", serif;
    }

    .register-subtitle {
      text-align: center;
      color: #6a6a6a;
      font-size: 0.938rem;
      margin-bottom: 2.5rem;
      font-family: Arial, Helvetica, sans-serif;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
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

    .hint {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: #6a6a6a;
      font-family: Arial, Helvetica, sans-serif;
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

    .warning-message {
      padding: 1rem;
      background: #fff3e0;
      color: #e65100;
      border-left: 4px solid #e65100;
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

    .login-link {
      text-align: center;
    }

    .login-link p {
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
      .register-container {
        padding: 2rem 1rem;
      }

      .register-card {
        padding: 2rem 1.5rem;
      }

      .register-title {
        font-size: 1.75rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  formData: RegisterRequest = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    password_confirmation: '',
    telephone: ''
  };

  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  register(): void {
    this.submitting.set(true);
    this.errorMessage.set(null);

    this.authService.register(this.formData).subscribe({
      next: (response) => {
        console.log('Inscription réussie:', response);
        this.router.navigate(['/account']);
      },
      error: (err: Error) => {
        console.error('Erreur inscription:', err);
        this.errorMessage.set(err.message);
        this.submitting.set(false);
      }
    });
  }
}