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
    <div class="auth-page">
      <div class="auth-card">
        <h1 class="auth-title">INSCRIPTION</h1>
        <p class="auth-subtitle">Rejoignez la famille Elaya</p>

        <form (ngSubmit)="register()" #registerForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label>Prénom</label>
              <input type="text" [(ngModel)]="formData.prenom" name="prenom" required class="auth-input">
            </div>
            <div class="form-group">
              <label>Nom</label>
              <input type="text" [(ngModel)]="formData.nom" name="nom" required class="auth-input">
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="formData.email" name="email" required class="auth-input" placeholder="email@exemple.com">
          </div>

          <div class="form-group">
            <label>Téléphone</label>
            <input type="tel" [(ngModel)]="formData.telephone" name="telephone" class="auth-input">
          </div>

          <div class="form-group">
            <label>Mot de passe</label>
            <input type="password" [(ngModel)]="formData.password" name="password" required minlength="8" class="auth-input" placeholder="Minimum 8 caractères">
          </div>

          <div class="form-group">
            <label>Confirmer</label>
            <input type="password" [(ngModel)]="formData.password_confirmation" name="password_confirmation" required class="auth-input">
          </div>

          <div *ngIf="errorMessage()" class="error-msg">{{ errorMessage() }}</div>

          <button type="submit" [disabled]="!registerForm.valid || submitting()" class="auth-btn">
            {{ submitting() ? 'Inscription...' : "S'INSCRIRE" }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Déjà membre ? <a routerLink="/login" class="gold-link">Se connecter</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { 
      min-height: 100vh; display: flex; align-items: center; justify-content: center; 
      background: var(--black-bg); padding: 4rem 2rem; 
    }
    .auth-card {
      width: 100%; max-width: 500px; background: var(--card-bg);
      padding: 3rem 2rem; border: 1px solid #333; position: relative;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .auth-card::before {
      content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px;
      background: var(--wax-border);
    }

    .auth-title { color: var(--gold); text-align: center; margin: 0; font-size: 2rem; }
    .auth-subtitle { color: #777; text-align: center; margin-bottom: 2rem; font-size: 0.9rem; }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    
    .form-group { margin-bottom: 1.2rem; }
    .form-group label { display: block; color: var(--text-main); font-size: 0.8rem; margin-bottom: 5px; font-family: 'Oswald'; letter-spacing: 1px;}
    
    .auth-input {
      width: 100%; padding: 12px; background: #111; border: 1px solid #444;
      color: white; font-family: 'Montserrat'; outline: none; transition: 0.3s; box-sizing: border-box;
    }
    .auth-input:focus { border-color: var(--gold); background: black; }

    .auth-btn {
      width: 100%; padding: 12px; background: var(--gold); border: none;
      font-weight: bold; cursor: pointer; transition: 0.3s; color: black; margin-top: 1rem;
    }
    .auth-btn:hover:not(:disabled) { background: white; }
    .auth-btn:disabled { background: #444; cursor: not-allowed; }

    .error-msg { color: var(--red-wax); text-align: center; margin-bottom: 1rem; font-size: 0.9rem; }

    .auth-footer { text-align: center; margin-top: 2rem; border-top: 1px solid #333; padding-top: 1rem; color: #888; font-size: 0.9rem;}
    .gold-link { color: var(--gold); text-decoration: none; font-weight: bold; }
    .gold-link:hover { text-decoration: underline; }
    
    @media(max-width:500px){ .form-row { grid-template-columns: 1fr; } }
  `]
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);
  formData: RegisterRequest = { nom: '', prenom: '', email: '', password: '', password_confirmation: '', telephone: '' };
  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  register(): void {
    if(this.formData.password !== this.formData.password_confirmation) {
      this.errorMessage.set('Les mots de passe ne correspondent pas'); return;
    }
    this.submitting.set(true);
    this.authService.register(this.formData).subscribe({
      next: () => { this.router.navigate(['/account']); },
      error: (err) => { this.errorMessage.set('Erreur inscription'); this.submitting.set(false); }
    });
  }
}