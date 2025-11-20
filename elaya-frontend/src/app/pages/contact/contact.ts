import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ContactRequest { nom: string; prenom: string; email: string; telephone?: string; sujet: string; message: string; }
interface ContactResponse { success: boolean; message: string; }

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contact-container">
      <h1 class="page-title">NOUS <span class="gold-text">CONTACTER</span></h1>

      <div class="contact-content">
        <div class="info-section">
          <h2 class="section-title">Restaurant Elaya</h2>
          <div class="separator"></div>
          
          <div class="info-item">
            <span class="icon">📍</span>
            <div>
              <h3>Adresse</h3>
              <p>2 Rue Victor Hugo, 63300 Thiers</p>
            </div>
          </div>

          <div class="info-item">
            <span class="icon">📞</span>
            <div>
              <h3>Téléphone</h3>
              <p>04 73 XX XX XX</p>
            </div>
          </div>

          <div class="info-item">
            <span class="icon">✉️</span>
            <div>
              <h3>Email</h3>
              <p>contact@elaya-restaurant.fr</p>
            </div>
          </div>

          <div class="info-item">
            <span class="icon">🕒</span>
            <div>
              <h3>Horaires</h3>
              <p>Mardi - Dimanche : 11h45 - 14h00</p>
              <p>Soirs & Week-end : 18h00 - 22h30</p>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2 class="section-title">Envoyez un message</h2>
          
          <form (ngSubmit)="submitContact()" #contactForm="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label>Prénom</label>
                <input type="text" [(ngModel)]="formData.prenom" name="prenom" required class="form-input">
              </div>
              <div class="form-group">
                <label>Nom</label>
                <input type="text" [(ngModel)]="formData.nom" name="nom" required class="form-input">
              </div>
            </div>

            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="formData.email" name="email" required class="form-input">
            </div>

            <div class="form-group">
              <label>Sujet</label>
              <input type="text" [(ngModel)]="formData.sujet" name="sujet" required class="form-input">
            </div>

            <div class="form-group">
              <label>Message</label>
              <textarea [(ngModel)]="formData.message" name="message" rows="5" required class="form-input textarea"></textarea>
            </div>

            <div *ngIf="successMessage()" class="msg success">{{ successMessage() }}</div>
            <div *ngIf="errorMessage()" class="msg error">{{ errorMessage() }}</div>

            <button type="submit" [disabled]="!contactForm.valid || submitting()" class="submit-btn">
              {{ submitting() ? 'ENVOI...' : 'ENVOYER LE MESSAGE' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-container { padding: 4rem 5%; min-height: 100vh; background: var(--black-bg); }
    .page-title { text-align: center; font-size: 3rem; color: var(--text-main); margin-bottom: 3rem; }
    .gold-text { color: var(--gold); font-style: italic; }

    .contact-content { 
      display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; 
      max-width: 1200px; margin: 0 auto; 
    }

    .section-title { color: var(--gold); font-size: 1.5rem; margin-bottom: 1rem; font-weight: 500;}
    .separator { width: 50px; height: 2px; background: var(--gold); margin-bottom: 2rem; }

    /* INFOS */
    .info-section { color: var(--text-main); }
    .info-item { display: flex; gap: 1.5rem; margin-bottom: 2rem; }
    .icon { font-size: 1.5rem; color: var(--gold); }
    .info-item h3 { font-size: 1rem; margin: 0 0 0.5rem; color: var(--text-muted); }
    .info-item p { margin: 0; font-size: 1rem; color: var(--text-main); }

    /* FORMULAIRE DARK */
    .form-section { background: var(--card-bg); padding: 2.5rem; border: 1px solid #333; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; color: var(--gold); font-size: 0.85rem; margin-bottom: 0.5rem; font-family: 'Oswald'; letter-spacing: 1px; }
    
    .form-input {
      width: 100%; padding: 12px; background: #111; border: 1px solid #333;
      color: white; font-family: 'Montserrat'; font-size: 1rem; outline: none;
      transition: 0.3s; box-sizing: border-box;
    }
    .form-input:focus { border-color: var(--gold); background: #000; }
    .textarea { resize: vertical; }

    .submit-btn {
      width: 100%; padding: 1rem; background: var(--gold); color: var(--black-bg);
      border: none; font-weight: 700; font-size: 1rem; margin-top: 1rem;
      transition: 0.3s;
    }
    .submit-btn:hover:not(:disabled) { background: var(--text-main); }
    .submit-btn:disabled { background: #333; color: #666; cursor: not-allowed; }

    .msg { padding: 1rem; margin-bottom: 1rem; text-align: center; font-weight: bold; }
    .msg.success { background: rgba(0, 148, 50, 0.1); color: var(--green-wax); border: 1px solid var(--green-wax); }
    .msg.error { color: var(--red-wax); }

    @media (max-width: 900px) { .contact-content { grid-template-columns: 1fr; } }
  `]
})
export class Contact {
  private apiUrl = 'http://localhost:8000/api/contact';
  formData = { nom: '', prenom: '', email: '', telephone: '', sujet: '', message: '' };
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  submitContact(): void {
    this.submitting.set(true);
    const contactData: ContactRequest = { ...this.formData, telephone: this.formData.telephone || undefined };

    this.http.post<ContactResponse>(this.apiUrl, contactData).subscribe({
      next: () => {
        this.successMessage.set('Message envoyé avec succès.'); this.resetForm(); this.submitting.set(false);
      },
      error: () => { this.errorMessage.set('Erreur lors de l\'envoi.'); this.submitting.set(false); }
    });
  }
  resetForm(): void { this.formData = { nom: '', prenom: '', email: '', telephone: '', sujet: '', message: '' }; }
}