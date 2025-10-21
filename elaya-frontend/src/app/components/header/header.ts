// src/app/components/header/header.ts

import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../api/auth';
import { OrderService } from '../../api/order';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="nav-container">
      <div class="logo">ELAYA</div>
      
      <div class="nav-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          Accueil
        </a>
        <a routerLink="/menu" routerLinkActive="active">Menu</a>
        <a routerLink="/order" routerLinkActive="active">Commander</a>
        <a routerLink="/events" routerLinkActive="active">Événements</a>
        <a routerLink="/contact" routerLinkActive="active">Contact</a>
      </div>

      <div class="nav-icons">
        <!-- Cart Icon with Badge -->
        <a routerLink="/cart" class="icon-link">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span *ngIf="orderService.getItemCount() > 0" class="badge">
            {{ orderService.getItemCount() }}
          </span>
        </a>

        <!-- User Icon -->
        <a *ngIf="!authService.isAuthenticated()" routerLink="/login" class="icon-link">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </a>

        <!-- Account Dropdown when logged in -->
        <div *ngIf="authService.isAuthenticated()" class="user-dropdown">
          <button class="user-btn" (click)="toggleDropdown()">
            <div class="user-avatar">
              {{ getInitials() }}
            </div>
          </button>
          
          <div *ngIf="showDropdown" class="dropdown-menu">
            <div class="dropdown-header">
              <p class="user-name">{{ authService.currentUser()?.prenom }} {{ authService.currentUser()?.nom }}</p>
              <p class="user-email">{{ authService.currentUser()?.email }}</p>
            </div>
            <div class="dropdown-divider"></div>
            <a routerLink="/account" (click)="closeDropdown()" class="dropdown-item">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Mon compte
            </a>
            <a *ngIf="authService.isAdmin()" routerLink="/admin" (click)="closeDropdown()" class="dropdown-item">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              Administration
            </a>
            <div class="dropdown-divider"></div>
            <button (click)="logout()" class="dropdown-item logout">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 5rem;
      background-color: #0f1f0f;
      position: relative;
    }

    .logo {
      color: white;
      font-size: 1.5rem;
      font-weight: 300;
      letter-spacing: 0.3em;
      font-family: Arial, Helvetica, sans-serif;
    }

    .nav-links {
      display: flex;
      gap: 2.5rem;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      font-size: 0.75rem;
      font-family: Arial, Helvetica, sans-serif;
      transition: color 0.3s;
      font-weight: 400;
    }

    .nav-links a:hover,
    .nav-links a.active {
      color: #d4a574;
    }

    .nav-icons {
      display: flex;
      gap: 1.25rem;
      align-items: center;
    }

    .icon-link {
      position: relative;
      color: white;
      cursor: pointer;
      transition: color 0.3s;
      display: flex;
      align-items: center;
    }

    .icon-link:hover {
      color: #d4a574;
    }

    .icon {
      width: 1rem;
      height: 1rem;
    }

    .badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #d4772e;
      color: white;
      font-size: 0.625rem;
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: 10px;
      min-width: 1.125rem;
      text-align: center;
      font-family: Arial, Helvetica, sans-serif;
    }

    .user-dropdown {
      position: relative;
    }

    .user-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }

    .user-avatar {
      width: 2rem;
      height: 2rem;
      background: #d4772e;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
      font-family: Arial, Helvetica, sans-serif;
      transition: background 0.3s;
    }

    .user-btn:hover .user-avatar {
      background: #b86625;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: #f5f1e8;
      border: 2px solid #c9984a;
      min-width: 220px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      z-index: 1000;
    }

    .dropdown-header {
      padding: 1rem;
      background: linear-gradient(135deg, #d4772e 0%, #c9984a 100%);
    }

    .user-name {
      color: white;
      font-size: 0.938rem;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
      font-family: Arial, Helvetica, sans-serif;
    }

    .user-email {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.75rem;
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
    }

    .dropdown-divider {
      height: 1px;
      background: #d4a574;
      margin: 0;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      color: #2a2a2a;
      text-decoration: none;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
      transition: background 0.3s;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }

    .dropdown-item:hover {
      background: rgba(212, 119, 46, 0.1);
    }

    .dropdown-item.logout {
      color: #c43d3d;
    }

    .dropdown-item.logout:hover {
      background: rgba(196, 61, 61, 0.1);
    }

    .dropdown-item .icon {
      width: 1rem;
      height: 1rem;
    }

    @media (max-width: 1024px) {
      .nav-container {
        padding: 1rem 2rem;
      }

      .nav-links {
        gap: 1.5rem;
      }

      .nav-links a {
        font-size: 0.7rem;
      }
    }

    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .nav-links {
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  `]
})
export class Header {
  authService = inject(AuthService);
  orderService = inject(OrderService);
  
  showDropdown = false;

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  logout(): void {
    this.closeDropdown();
    this.authService.logout();
  }

  getInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return '?';
    return `${user.prenom[0]}${user.nom[0]}`.toUpperCase();
  }
}