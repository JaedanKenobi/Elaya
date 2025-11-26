import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../api/order';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="container nav-container">
        
        <button class="menu-toggle" (click)="toggleMenu()">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <a routerLink="/" class="logo">
          ELAYA<span class="dot">.</span>
        </a>

        <div class="nav-links" [class.open]="isMenuOpen()" (click)="toggleMenu()">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Accueil</a>
          <a routerLink="/menu" routerLinkActive="active">La Carte</a>
          <a routerLink="/events" routerLinkActive="active">Événements</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
          <a routerLink="/menu" class="cta-link">CLICK & COLLECT</a>
        </div>

        <div class="nav-actions">
          <a routerLink="/cart" class="cart-btn">
            PANIER <span class="badge">{{ orderService.getItemCount() }}</span>
          </a>
          <a routerLink="/login" class="user-icon">👤</a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: rgba(5, 5, 5, 0.95);
      border-bottom: 1px solid #333;
      padding: 1.5rem 0;
      position: sticky; top: 0; z-index: 1000;
      backdrop-filter: blur(10px);
    }
    .nav-container {
      display: flex; justify-content: space-between; align-items: center;
      width: 90%; margin: 0 auto; max-width: 1200px;
    }
    .logo {
      font-family: 'Oswald', sans-serif; font-size: 2rem; font-weight: 700;
      color: var(--text-main); text-decoration: none; letter-spacing: 2px;
    }
    .dot { color: var(--gold); }
    
    .nav-links { display: flex; gap: 30px; align-items: center; }
    .nav-links a {
      color: var(--text-muted); text-decoration: none; font-size: 0.9rem;
      text-transform: uppercase; transition: 0.3s; font-weight: 500;
    }
    .nav-links a:hover, .nav-links a.active { color: var(--gold); }
    
    .cta-link { border: 1px solid var(--gold); padding: 5px 15px; color: var(--gold) !important; }
    .cta-link:hover { background: var(--gold); color: black !important; }

    .nav-actions { display: flex; align-items: center; gap: 20px; }
    .cart-btn {
      background: transparent; border: 1px solid var(--text-muted);
      color: var(--text-main); padding: 8px 15px; font-size: 0.8rem;
      text-decoration: none; transition: 0.3s; font-family: 'Oswald', sans-serif;
      display: flex; align-items: center; gap: 8px;
    }
    .badge {
      background: var(--gold); color: black; padding: 1px 6px;
      border-radius: 50%; font-size: 0.75rem; font-weight: bold;
    }
    .user-icon { text-decoration: none; font-size: 1.2rem; color: var(--text-main); }

    .menu-toggle { display: none; background: none; border: none; color: var(--gold); cursor: pointer; }
    .menu-toggle .icon { width: 28px; height: 28px; }

    /* --- RESPONSIVE --- */
    @media (max-width: 1024px) {
      .menu-toggle { display: block; }
      
      .nav-links {
        display: flex; position: fixed; top: 0; right: 0;
        width: 75%; max-width: 300px; height: 100vh;
        flex-direction: column; background-color: #000;
        padding: 6rem 2rem; box-shadow: -5px 0 15px rgba(0,0,0,0.8);
        transform: translateX(100%); transition: transform 0.3s ease-in-out;
        align-items: flex-start;
      }
      .nav-links.open { transform: translateX(0); }
      .nav-links a {
        padding: 1.5rem 0; border-bottom: 1px solid #222; width: 100%; font-size: 1.1rem;
      }
      .cta-link { border: none; margin-top: 1rem; color: var(--gold) !important; font-weight: bold;}
    }
  `]
})
export class Header {
  orderService = inject(OrderService);
  isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }
}