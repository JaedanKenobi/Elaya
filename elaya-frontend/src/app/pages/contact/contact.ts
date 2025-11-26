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
          <div class="info-item"><h3>Adresse</h3><p>2 Rue Victor Hugo, 63300 Thiers</p></div>
          <div class="info-item"><h3>Téléphone</h3><p>04 73 XX XX XX</p></div>
          <div class="info-item"><h3>Email</h3><p>contact@elaya.fr</p></div>
        </div>

        <div class="form-section">
          <form (ngSubmit)="submitContact()" #contactForm="ngForm">
            <div class="form-row">
              <div class="form-group"><label>Prénom</label><input type="text" [(ngModel)]="formData.prenom" name="prenom" required class="form-input"></div>
              <div class="form-group"><label>Nom</label><input type="text" [(ngModel)]="formData.nom" name="nom" required class="form-input"></div>
            </div>
            <div class="form-group"><label>Email</label><input type="email" [(ngModel)]="formData.email" name="email" required class="form-input"></div>
            <div class="form-group"><label>Sujet</label><input type="text" [(ngModel)]="formData.sujet" name="sujet" required class="form-input"></div>
            <div class="form-group"><label>Message</label><textarea [(ngModel)]="formData.message" name="message" rows="5" required class="form-input textarea"></textarea></div>
            
            <div *ngIf="successMessage()" class="msg success">{{ successMessage() }}</div>
            <button type="submit" [disabled]="!contactForm.valid || submitting()" class="submit-btn">ENVOYER</button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-container { padding: 4rem 5%; min-height: 100vh; background: var(--black-bg); color: var(--text-main); }
    .page-title { text-align: center; font-size: 3rem; margin-bottom: 3rem; }
    .gold-text { color: var(--gold); font-style: italic; }
    .contact-content { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; max-width: 1200px; margin: 0 auto; }
    .section-title { color: var(--gold); font-size: 1.5rem; margin-bottom: 1.5rem; }
    .info-section { background: var(--card-bg); padding: 2rem; border: 1px solid #333; }
    .info-item { margin-bottom: 1.5rem; }
    .info-item h3 { color: var(--gold); margin-bottom: 0.5rem; }
    
    .form-section { background: var(--card-bg); padding: 2.5rem; border: 1px solid #333; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1.2rem; }
    .form-group label { display: block; color: var(--text-muted); font-size: 0.8rem; margin-bottom: 5px; }
    .form-input { width: 100%; padding: 12px; background: #050505; border: 1px solid #444; color: white; outline: none; box-sizing: border-box; }
    .form-input:focus { border-color: var(--gold); }
    .submit-btn { width: 100%; padding: 1rem; background: var(--gold); color: black; border: none; font-weight: bold; margin-top: 1rem; cursor: pointer; }
    .msg.success { color: #00ff00; text-align: center; margin-bottom: 1rem; }

    /* --- RESPONSIVE --- */
    @media (max-width: 900px) {
      .contact-content { grid-template-columns: 1fr; gap: 2rem; }
      .info-section { order: -1; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class Contact {
  private apiUrl = 'http://localhost:8000/api/contact';
  formData = { nom: '', prenom: '', email: '', telephone: '', sujet: '', message: '' };
  submitting = signal(false);
  successMessage = signal<string | null>(null);
  constructor(private http: HttpClient) {}
  submitContact(): void {
    this.submitting.set(true);
    this.http.post<ContactResponse>(this.apiUrl, this.formData).subscribe({
      next: () => { this.successMessage.set('Envoyé !'); this.submitting.set(false); },
      error: () => { this.submitting.set(false); }
    });
  }
}