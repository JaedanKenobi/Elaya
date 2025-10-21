// src/app/pages/newsletter/newsletter.ts

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface NewsletterRequest {
  email: string;
}

interface NewsletterResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="newsletter-container">
      <div class="newsletter-content">
        <div class="newsletter-header">
          <h1 class="newsletter-title">NEWSLETTER</h1>
          <p class="newsletter-subtitle">Restez informés de nos actualités</p>
        </div>

        <div class="benefits">
          <div class="benefit-item">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <div>
              <h3>Offres exclusives</h3>
              <p>Profitez d'offres réservées à nos abonnés</p>
            </div>
          </div>

          <div class="benefit-item">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <div>
              <h3>Événements à venir</h3>
              <p>Soyez les premiers informés de nos événements</p>
            </div>
          </div>

          <div class="benefit-item">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <div>
              <h3>Nouveautés du menu</h3>
              <p>Découvrez en avant-première nos nouveaux plats</p>
            </div>
          </div>

          <div class="benefit-item">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <div>
              <h3>Plats du jour</h3>
              <p>Recevez notre sélection hebdomadaire</p>
            </div>
          </div>
        </div>

        <div class="subscription-form">
          <h2>Inscrivez-vous maintenant</h2>
          
          <form (ngSubmit)="subscribe()" #newsletterForm="ngForm">
            <div class="form-group">
              <label for="email">Votre adresse email *</label>
              <div class="input-with-button">
                <input 
                  type="email" 
                  id="email"
                  [(ngModel)]="email" 
                  name="email"
                  placeholder="exemple@email.com"
                  required
                  class="form-input">
                <button 
                  type="submit" 
                  [disabled]="!newsletterForm.valid || submitting()"
                  class="submit-btn">
                  {{ submitting() ? '...' : "S'inscrire" }}
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage()" class="error-message">
              {{ errorMessage() }}
            </div>

            <!-- Success Message -->
            <div *ngIf="successMessage()" class="success-message">
              {{ successMessage() }}
            </div>

            <p class="privacy-notice">
              En vous inscrivant, vous acceptez de recevoir nos emails et vous pouvez vous désabonner à tout moment.
              Vos données sont protégées conformément à notre politique de confidentialité.
            </p>
          </form>
        </div>

        <div class="testimonials">
          <h2>Ce que disent nos abonnés</h2>
          <div class="testimonials-grid">
            <div class="testimonial">
              <p class="quote">"J'adore recevoir les nouvelles du restaurant ! Les offres exclusives sont géniales."</p>
              <p class="author">- Marie L.</p>
            </div>
            <div class="testimonial">
              <p class="quote">"Grâce à la newsletter, je ne rate aucun événement. C'est parfait !"</p>
              <p class="author">- Pierre D.</p>
            </div>
            <div class="testimonial">
              <p class="quote">"Les plats du jour me donnent toujours envie de venir au restaurant."</p>
              <p class="author">- Sophie M.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .newsletter-container {
      padding: 3rem 5rem;
      min-height: 100vh;
    }

    .newsletter-content {
      max-width: 1000px;
      margin: 0 auto;
    }

    .newsletter-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .newsletter-title {
      color: #f5f1e8;
      font-size: 3rem;
      font-weight: 300;
      letter-spacing: 0.2em;
      margin-bottom: 1rem;
      font-family: Georgia, "Times New Roman", serif;
    }

    .newsletter-subtitle {
      color: #d4a574;
      font-size: 1.25rem;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 300;
    }

    .benefits {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .benefit-item {
      display: flex;
      gap: 1.5rem;
      padding: 2rem;
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      border: 2px solid #c9984a;
      transition: all 0.3s;
    }

    .benefit-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(201, 152, 74, 0.3);
    }

    .benefit-item .icon {
      width: 3rem;
      height: 3rem;
      color: #d4772e;
      flex-shrink: 0;
    }

    .benefit-item h3 {
      font-size: 1.125rem;
      color: #2a2a2a;
      margin-bottom: 0.5rem;
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 600;
    }

    .benefit-item p {
      font-size: 0.875rem;
      color: #4a4a4a;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
    }

    .subscription-form {
      background: linear-gradient(135deg, #d4772e 0%, #c9984a 100%);
      padding: 3rem;
      border: 3px solid #8b7355;
      margin-bottom: 4rem;
    }

    .subscription-form h2 {
      color: white;
      font-size: 1.75rem;
      font-weight: 300;
      letter-spacing: 0.1em;
      margin-bottom: 2rem;
      text-align: center;
      font-family: Georgia, "Times New Roman", serif;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.75rem;
      color: white;
      font-size: 1rem;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 600;
      text-align: center;
    }

    .input-with-button {
      display: flex;
      gap: 1rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .form-input {
      flex: 1;
      padding: 1rem;
      border: 3px solid white;
      background: white;
      font-size: 1rem;
      font-family: Arial, Helvetica, sans-serif;
      color: #2a2a2a;
    }

    .form-input:focus {
      outline: none;
      border-color: #f5f1e8;
    }

    .submit-btn {
      padding: 1rem 2.5rem;
      background: #2a2a2a;
      color: white;
      border: 3px solid #2a2a2a;
      font-size: 1rem;
      font-family: Arial, Helvetica, sans-serif;
      cursor: pointer;
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
      white-space: nowrap;
    }

    .submit-btn:hover:not(:disabled) {
      background: white;
      color: #2a2a2a;
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message {
      padding: 1rem;
      background: #ffebee;
      color: #c62828;
      border-left: 4px solid #c62828;
      margin-top: 1rem;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
    }

    .success-message {
      padding: 1rem;
      background: #e8f5e9;
      color: #2e7d32;
      border-left: 4px solid #2e7d32;
      margin-top: 1rem;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
    }

    .privacy-notice {
      color: white;
      font-size: 0.75rem;
      font-family: Arial, Helvetica, sans-serif;
      text-align: center;
      margin-top: 1.5rem;
      line-height: 1.6;
      opacity: 0.9;
    }

    .testimonials h2 {
      color: #f5f1e8;
      font-size: 1.75rem;
      font-weight: 300;
      letter-spacing: 0.1em;
      margin-bottom: 2rem;
      text-align: center;
      font-family: Georgia, "Times New Roman", serif;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .testimonial {
      padding: 2rem;
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      border: 2px solid #c9984a;
      text-align: center;
    }

    .quote {
      font-size: 0.938rem;
      color: #2a2a2a;
      font-family: Georgia, "Times New Roman", serif;
      font-style: italic;
      line-height: 1.7;
      margin-bottom: 1rem;
    }

    .author {
      font-size: 0.875rem;
      color: #d4772e;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 600;
    }

    @media (max-width: 1024px) {
      .newsletter-container {
        padding: 2rem;
      }

      .benefits {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .testimonials-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .newsletter-container {
        padding: 1.5rem 1rem;
      }

      .newsletter-title {
        font-size: 2rem;
      }

      .input-with-button {
        flex-direction: column;
      }

      .submit-btn {
        width: 100%;
      }

      .subscription-form {
        padding: 2rem 1.5rem;
      }
    }
  `]
})
export class Newsletter {
  private apiUrl = 'http://localhost:8000/api/newsletter';

  email = '';
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  subscribe(): void {
    this.submitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const data: NewsletterRequest = {
      email: this.email
    };

    this.http.post<NewsletterResponse>(this.apiUrl, data).subscribe({
      next: (response) => {
        console.log('Inscription newsletter:', response);
        this.successMessage.set('Merci pour votre inscription ! Vous recevrez bientôt nos actualités.');
        this.email = '';
        this.submitting.set(false);
      },
      error: (err: Error) => {
        console.error('Erreur newsletter:', err);
        this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
        this.submitting.set(false);
      }
    });
  }
}