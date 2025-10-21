// src/app/pages/contact/contact.ts

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ContactRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contact-container">
      <h1 class="contact-title">NOUS CONTACTER</h1>

      <div class="contact-content">
        
        <!-- Left: Contact Info -->
        <div class="info-section">
          <h2 class="section-title">Restaurant Elaya</h2>
          
          <div class="info-items">
            <div class="info-item">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div>
                <h3>Adresse</h3>
                <p>2 Rue Victor Hugo</p>
                <p>63300 Thiers</p>
              </div>
            </div>

            <div class="info-item">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <div>
                <h3>Téléphone</h3>
                <p>04 73 XX XX XX</p>
              </div>
            </div>

            <div class="info-item">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <div>
                <h3>Email</h3>
                <p>contact@elaya-restaurant.fr</p>
              </div>
            </div>

            <div class="info-item">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <div>
                <h3>Horaires</h3>
                <p><strong>Mardi à Dimanche</strong></p>
                <p>11h45 - 14h00</p>
                <p><strong>Mardi à Jeudi et Dimanche</strong></p>
                <p>18h00 - 22h00</p>
                <p><strong>Vendredi - Samedi</strong></p>
                <p>18h00 - 22h30</p>
              </div>
            </div>
          </div>

          <div class="social-section">
            <h3>Suivez-nous</h3>
            <div class="social-icons">
              <a href="#" class="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              <a href="#" class="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="#" class="social-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Right: Contact Form -->
        <div class="form-section">
          <h2 class="section-title">Envoyez-nous un message</h2>
          
          <form (ngSubmit)="submitContact()" #contactForm="ngForm">
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
                required
                class="form-input">
            </div>

            <div class="form-group">
              <label>Téléphone</label>
              <input 
                type="tel" 
                [(ngModel)]="formData.telephone" 
                name="telephone"
                class="form-input">
            </div>

            <div class="form-group">
              <label>Sujet *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.sujet" 
                name="sujet"
                required
                class="form-input">
            </div>

            <div class="form-group">
              <label>Message *</label>
              <textarea 
                [(ngModel)]="formData.message" 
                name="message"
                rows="6"
                required
                class="form-input textarea"></textarea>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage()" class="error-message">
              {{ errorMessage() }}
            </div>

            <!-- Success Message -->
            <div *ngIf="successMessage()" class="success-message">
              {{ successMessage() }}
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              [disabled]="!contactForm.valid || submitting()"
              class="submit-btn">
              {{ submitting() ? 'Envoi en cours...' : 'Envoyer le message' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-container {
      padding: 3rem 5rem;
      min-height: 100vh;
    }

    .contact-title {
      text-align: center;
      color: #f5f1e8;
      font-size: 3rem;
      font-weight: 300;
      letter-spacing: 0.2em;
      margin-bottom: 3rem;
      font-family: Georgia, "Times New Roman", serif;
    }

    .contact-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-title {
      color: #2a2a2a;
      font-size: 1.25rem;
      font-weight: 400;
      letter-spacing: 0.1em;
      margin-bottom: 2rem;
      font-family: Georgia, "Times New Roman", serif;
      text-align: center;
    }

    /* Info Section */
    .info-section {
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      padding: 2rem;
      border: 3px solid #c9984a;
    }

    .info-items {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .info-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-left: 4px solid #d4772e;
    }

    .info-item .icon {
      width: 2rem;
      height: 2rem;
      color: #d4772e;
      flex-shrink: 0;
    }

    .info-item h3 {
      font-size: 1rem;
      color: #2a2a2a;
      margin-bottom: 0.5rem;
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 600;
    }

    .info-item p {
      font-size: 0.875rem;
      color: #4a4a4a;
      margin: 0.25rem 0;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
    }

    .social-section {
      padding: 1.5rem;
      background: white;
      border: 2px solid #d4a574;
      text-align: center;
    }

    .social-section h3 {
      font-size: 1rem;
      color: #2a2a2a;
      margin-bottom: 1rem;
      font-family: Georgia, "Times New Roman", serif;
    }

    .social-icons {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
    }

    .social-link {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #d4772e;
      color: white;
      border-radius: 50%;
      transition: all 0.3s;
    }

    .social-link:hover {
      background: #b86625;
      transform: translateY(-3px);
    }

    .social-link svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    /* Form Section */
    .form-section {
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      padding: 2rem;
      border: 3px solid #c9984a;
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
      padding: 0.75rem;
      border: 2px solid #c9984a;
      background: white;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
      color: #2a2a2a;
      transition: border-color 0.3s;
    }

    .form-input:focus {
      outline: none;
      border-color: #d4772e;
    }

    .textarea {
      resize: vertical;
      min-height: 120px;
    }

    .error-message {
      padding: 1rem;
      background: #ffebee;
      color: #c62828;
      border-left: 4px solid #c62828;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
    }

    .success-message {
      padding: 1rem;
      background: #e8f5e9;
      color: #2e7d32;
      border-left: 4px solid #2e7d32;
      margin-bottom: 1rem;
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

    @media (max-width: 1024px) {
      .contact-container {
        padding: 2rem;
      }

      .contact-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    @media (max-width: 768px) {
      .contact-container {
        padding: 1.5rem 1rem;
      }

      .contact-title {
        font-size: 2rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .info-section,
      .form-section {
        padding: 1.5rem;
      }
    }
  `]
})
export class Contact {
  private apiUrl = 'http://localhost:8000/api/contact';

  formData = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  };

  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  submitContact(): void {
    this.submitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const contactData: ContactRequest = {
      nom: this.formData.nom,
      prenom: this.formData.prenom,
      email: this.formData.email,
      telephone: this.formData.telephone || undefined,
      sujet: this.formData.sujet,
      message: this.formData.message
    };

    this.http.post<ContactResponse>(this.apiUrl, contactData).subscribe({
      next: (response) => {
        console.log('Message envoyé:', response);
        this.successMessage.set('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
        this.resetForm();
        this.submitting.set(false);
      },
      error: (err: Error) => {
        console.error('Erreur contact:', err);
        this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
        this.submitting.set(false);
      }
    });
  }

  resetForm(): void {
    this.formData = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      sujet: '',
      message: ''
    };
  }
}