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
    <div class="auth-page">
      <div class="auth-card">
        <h1 class="auth-title">CONNEXION</h1>
        <p class="auth-subtitle">Espace Client Elaya</p>

        <form (ngSubmit)="login()" #loginForm="ngForm">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="credentials.email" name="email" required class="auth-input" placeholder="email@exemple.com">
          </div>

          <div class="form-group">
            <label>Mot de passe</label>
            <input type="password" [(ngModel)]="credentials.password" name="password" required class="auth-input" placeholder="••••••">
          </div>

          <div *ngIf="errorMessage()" class="error-msg">{{ errorMessage() }}</div>

          <button type="submit" [disabled]="!loginForm.valid || submitting()" class="auth-btn">
            {{ submitting() ? 'Connexion...' : 'SE CONNECTER' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Pas encore membre ? <a routerLink="/register" class="gold-link">Créer un compte</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { 
      min-height: 80vh; display: flex; align-items: center; justify-content: center; 
      background: var(--black-bg); padding: 2rem; 
    }
    .auth-card {
      width: 100%; max-width: 400px; background: var(--card-bg);
      padding: 3rem 2rem; border: 1px solid #333; position: relative;
    }
    /* Touche WAX en haut de la carte */
    .auth-card::top {
      content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px;
      background: var(--wax-border);
    }

    .auth-title { color: var(--gold); text-align: center; margin: 0; font-size: 2rem; }
    .auth-subtitle { color: #777; text-align: center; margin-bottom: 2rem; font-size: 0.9rem; }

    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; color: var(--text-main); font-size: 0.8rem; margin-bottom: 5px; font-family: 'Oswald'; letter-spacing: 1px;}
    
    .auth-input {
      width: 100%; padding: 12px; background: #111; border: 1px solid #444;
      color: white; font-family: 'Montserrat'; outline: none; transition: 0.3s; box-sizing: border-box;
    }
    .auth-input:focus { border-color: var(--gold); }

    .auth-btn {
      width: 100%; padding: 12px; background: var(--gold); border: none;
      font-weight: bold; cursor: pointer; transition: 0.3s; color: black;
    }
    .auth-btn:hover { background: white; }

    .error-msg { color: var(--red-wax); text-align: center; margin-bottom: 1rem; font-size: 0.9rem; }

    .auth-footer { text-align: center; margin-top: 2rem; border-top: 1px solid #333; padding-top: 1rem; color: #888; font-size: 0.9rem;}
    .gold-link { color: var(--gold); text-decoration: none; font-weight: bold; }
    .gold-link:hover { text-decoration: underline; }
  `]
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  credentials: LoginRequest = { email: '', password: '' };
  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  login(): void {
    this.submitting.set(true);
    this.authService.login(this.credentials).subscribe({
      next: () => { this.router.navigate(['/account']); },
      error: (err) => { this.errorMessage.set('Identifiants incorrects'); this.submitting.set(false); }
    });
  }
}