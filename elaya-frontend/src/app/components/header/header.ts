import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="container nav-container">
        <a routerLink="/" class="logo">
          ELAYA<span class="dot"></span>
        </a>

        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Accueil</a>
          <a routerLink="/menu" routerLinkActive="active">La Carte</a>
          <a routerLink="/events" routerLinkActive="active">Événements</a>
          <a routerLink="/reservation" routerLinkActive="active">Réserver</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
        </div>

        <div class="nav-actions">
          <a routerLink="/cart" class="cart-btn">
            PANIER <span class="badge">0</span>
          </a>
          <a routerLink="/login" class="user-icon">👤</a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: rgba(15, 15, 15, 0.95);
      border-bottom: 1px solid #333;
      padding: 1.5rem 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }
    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 90%;
      margin: 0 auto;
      max-width: 1200px;
    }
    .logo {
      font-family: 'Oswald', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-main);
      text-decoration: none;
      letter-spacing: 2px;
    }
    .dot { color: var(--gold); }
    
    .nav-links { display: flex; gap: 30px; }
    .nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.9rem;
      text-transform: uppercase;
      transition: 0.3s;
      font-weight: 500;
    }
    .nav-links a:hover, .nav-links a.active {
      color: var(--gold);
    }

    .nav-actions { display: flex; align-items: center; gap: 20px; }
    .cart-btn {
      background: transparent;
      border: 1px solid var(--gold);
      color: var(--gold);
      padding: 8px 20px;
      font-size: 0.9rem;
      text-decoration: none;
      transition: 0.3s;
      font-family: 'Oswald', sans-serif;
    }
    .cart-btn:hover {
      background: var(--gold);
      color: var(--black-bg);
    }
    .badge {
      background: var(--text-main);
      color: var(--black-bg);
      padding: 2px 6px;
      border-radius: 50%;
      font-size: 0.8rem;
      margin-left: 5px;
      font-family: sans-serif;
      font-weight: bold;
    }
    .user-icon { text-decoration: none; font-size: 1.2rem; color: var(--text-main); }
  `]
})
export class Header {}