// src/app/pages/account/account.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../api/auth';
import { Reservation } from '../../types/reservation';
import { Order } from '../../types/order';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="account-container">
      <h1 class="account-title">MON COMPTE</h1>

      <div class="account-content">
        
        <!-- Sidebar Navigation -->
        <div class="sidebar">
          <div class="user-info">
            <div class="avatar">
              {{ getInitials() }}
            </div>
            <h2>{{ authService.currentUser()?.prenom }} {{ authService.currentUser()?.nom }}</h2>
            <p>{{ authService.currentUser()?.email }}</p>
          </div>

          <nav class="sidebar-nav">
            <button 
              [class.active]="activeTab() === 'profile'"
              (click)="activeTab.set('profile')"
              class="nav-btn">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Mes informations
            </button>

            <button 
              [class.active]="activeTab() === 'reservations'"
              (click)="activeTab.set('reservations')"
              class="nav-btn">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Mes réservations
            </button>

            <button 
              [class.active]="activeTab() === 'orders'"
              (click)="activeTab.set('orders')"
              class="nav-btn">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Mes commandes
            </button>

            <button (click)="logout()" class="nav-btn logout-btn">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Déconnexion
            </button>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="main-content">
          
          <!-- Profile Tab -->
          <div *ngIf="activeTab() === 'profile'" class="tab-content">
            <h2 class="tab-title">Mes informations personnelles</h2>
            
            <form (ngSubmit)="updateProfile()" #profileForm="ngForm">
              <div class="form-row">
                <div class="form-group">
                  <label>Prénom</label>
                  <input 
                    type="text" 
                    [(ngModel)]="profileData.prenom" 
                    name="prenom"
                    class="form-input">
                </div>

                <div class="form-group">
                  <label>Nom</label>
                  <input 
                    type="text" 
                    [(ngModel)]="profileData.nom" 
                    name="nom"
                    class="form-input">
                </div>
              </div>

              <div class="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  [(ngModel)]="profileData.email" 
                  name="email"
                  class="form-input">
              </div>

              <div *ngIf="successMessage()" class="success-message">
                {{ successMessage() }}
              </div>

              <div *ngIf="errorMessage()" class="error-message">
                {{ errorMessage() }}
              </div>

              <button type="submit" [disabled]="submitting()" class="submit-btn">
                {{ submitting() ? 'Mise à jour...' : 'Mettre à jour' }}
              </button>
            </form>
          </div>

          <!-- Reservations Tab -->
          <div *ngIf="activeTab() === 'reservations'" class="tab-content">
            <h2 class="tab-title">Mes réservations</h2>

            <div *ngIf="loadingReservations()" class="loading">
              Chargement...
            </div>

            <div *ngIf="!loadingReservations() && reservations().length === 0" class="empty-state">
              <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <p>Vous n'avez pas encore de réservation</p>
            </div>

            <div *ngIf="!loadingReservations() && reservations().length > 0" class="list-items">
              <div *ngFor="let reservation of reservations()" class="list-item">
                <div class="item-header">
                  <h3>Réservation du {{ formatDate(reservation.date) }}</h3>
                  <span class="badge" [class.confirmed]="reservation.statut === 'confirmee'">
                    {{ getStatutLabel(reservation.statut) }}
                  </span>
                </div>
                <div class="item-details">
                  <p><strong>Heure :</strong> {{ reservation.heure }}</p>
                  <p><strong>Nombre de personnes :</strong> {{ reservation.nombrePersonnes }}</p>
                  <p *ngIf="reservation.demandeSpeciale"><strong>Note :</strong> {{ reservation.demandeSpeciale }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Orders Tab -->
          <div *ngIf="activeTab() === 'orders'" class="tab-content">
            <h2 class="tab-title">Mes commandes</h2>

            <div *ngIf="loadingOrders()" class="loading">
              Chargement...
            </div>

            <div *ngIf="!loadingOrders() && orders().length === 0" class="empty-state">
              <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <p>Vous n'avez pas encore de commande</p>
            </div>

            <div *ngIf="!loadingOrders() && orders().length > 0" class="list-items">
              <div *ngFor="let order of orders()" class="list-item">
                <div class="item-header">
                  <h3>Commande #{{ order.id }}</h3>
                  <span class="badge" [class.ready]="order.statut === 'pret'">
                    {{ getOrderStatutLabel(order.statut) }}
                  </span>
                </div>
                <div class="item-details">
                  <p><strong>Date :</strong> {{ formatDate(order.createdAt || '') }}</p>
                  <p *ngIf="order.heureRetrait"><strong>Heure de retrait :</strong> {{ order.heureRetrait }}</p>
                  <p><strong>Total :</strong> {{ order.total }}€</p>
                  <div class="order-items">
                    <p><strong>Articles :</strong></p>
                    <ul>
                      <li *ngFor="let item of order.plats">
                        {{ item.quantite }}x plat ID {{ item.platId }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .account-container {
      padding: 3rem 5rem;
      min-height: 100vh;
    }

    .account-title {
      text-align: center;
      color: #f5f1e8;
      font-size: 3rem;
      font-weight: 300;
      letter-spacing: 0.2em;
      margin-bottom: 3rem;
      font-family: Georgia, "Times New Roman", serif;
    }

    .account-content {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 3rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Sidebar */
    .sidebar {
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      border: 3px solid #c9984a;
      padding: 2rem;
      height: fit-content;
      position: sticky;
      top: 2rem;
    }

    .user-info {
      text-align: center;
      padding-bottom: 2rem;
      border-bottom: 2px solid #d4a574;
      margin-bottom: 2rem;
    }

    .avatar {
      width: 80px;
      height: 80px;
      background: #d4772e;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 600;
      margin: 0 auto 1rem;
      font-family: Arial, Helvetica, sans-serif;
    }

    .user-info h2 {
      font-size: 1.125rem;
      color: #2a2a2a;
      margin-bottom: 0.5rem;
      font-family: Georgia, "Times New Roman", serif;
    }

    .user-info p {
      font-size: 0.875rem;
      color: #6a6a6a;
      font-family: Arial, Helvetica, sans-serif;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: white;
      border: 2px solid transparent;
      color: #2a2a2a;
      font-size: 0.938rem;
      font-family: Arial, Helvetica, sans-serif;
      cursor: pointer;
      transition: all 0.3s;
      text-align: left;
    }

    .nav-btn:hover {
      border-color: #d4a574;
    }

    .nav-btn.active {
      background: #d4772e;
      color: white;
      border-color: #d4772e;
    }

    .nav-btn .icon {
      width: 1.25rem;
      height: 1.25rem;
    }

    .logout-btn {
      margin-top: 1rem;
      border-color: #c43d3d;
      color: #c43d3d;
    }

    .logout-btn:hover {
      background: #c43d3d;
      color: white;
    }

    /* Main Content */
    .main-content {
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      border: 3px solid #c9984a;
      padding: 3rem;
    }

    .tab-title {
      font-size: 1.75rem;
      color: #2a2a2a;
      margin-bottom: 2rem;
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 400;
      border-bottom: 2px solid #d4a574;
      padding-bottom: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
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

    .submit-btn {
      padding: 1rem 3rem;
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

    .success-message {
      padding: 1rem;
      background: #e8f5e9;
      color: #2e7d32;
      border-left: 4px solid #2e7d32;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
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

    .loading,
    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: #6a6a6a;
      font-family: Arial, Helvetica, sans-serif;
    }

    .empty-icon {
      width: 4rem;
      height: 4rem;
      color: #d4a574;
      margin-bottom: 1rem;
    }

    .list-items {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .list-item {
      background: white;
      padding: 1.5rem;
      border: 2px solid #d4a574;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .item-header h3 {
      font-size: 1.125rem;
      color: #2a2a2a;
      font-family: Georgia, "Times New Roman", serif;
    }

    .badge {
      padding: 0.375rem 0.875rem;
      background: #e0e0e0;
      color: #4a4a4a;
      font-size: 0.75rem;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge.confirmed,
    .badge.ready {
      background: #4caf50;
      color: white;
    }

    .item-details p {
      font-size: 0.938rem;
      color: #4a4a4a;
      margin: 0.5rem 0;
      font-family: Arial, Helvetica, sans-serif;
    }

    .order-items {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }

    .order-items ul {
      list-style: none;
      padding: 0;
      margin: 0.5rem 0 0 0;
    }

    .order-items li {
      padding: 0.25rem 0;
      font-size: 0.875rem;
      color: #6a6a6a;
    }

    @media (max-width: 1024px) {
      .account-container {
        padding: 2rem;
      }

      .account-content {
        grid-template-columns: 1fr;
      }

      .sidebar {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .account-container {
        padding: 1.5rem 1rem;
      }

      .account-title {
        font-size: 2rem;
      }

      .main-content {
        padding: 2rem 1.5rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class Account implements OnInit {
  authService = inject(AuthService);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api';

  activeTab = signal<string>('profile');
  
  profileData = {
    nom: '',
    prenom: '',
    email: ''
  };

  reservations = signal<Reservation[]>([]);
  orders = signal<Order[]>([]);
  
  loadingReservations = signal(false);
  loadingOrders = signal(false);
  submitting = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProfile();
    this.loadReservations();
    this.loadOrders();
  }

  loadProfile(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.profileData = {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email
      };
    }
  }

  loadReservations(): void {
    this.loadingReservations.set(true);
    this.http.get<Reservation[]>(`${this.apiUrl}/mes-reservations`).subscribe({
      next: (data) => {
        this.reservations.set(data);
        this.loadingReservations.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement réservations:', err);
        this.loadingReservations.set(false);
      }
    });
  }

  loadOrders(): void {
    this.loadingOrders.set(true);
    this.http.get<Order[]>(`${this.apiUrl}/mes-commandes`).subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loadingOrders.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement commandes:', err);
        this.loadingOrders.set(false);
      }
    });
  }

  updateProfile(): void {
    this.submitting.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.authService.updateProfile(this.profileData).subscribe({
      next: () => {
        this.successMessage.set('Profil mis à jour avec succès !');
        this.submitting.set(false);
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message);
        this.submitting.set(false);
      }
    });
  }

  logout(): void {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      this.authService.logout();
    }
  }

  getInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return '?';
    return `${user.prenom[0]}${user.nom[0]}`.toUpperCase();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getStatutLabel(statut?: string): string {
    const labels: Record<string, string> = {
      'en_attente': 'En attente',
      'confirmee': 'Confirmée',
      'annulee': 'Annulée'
    };
    return labels[statut || 'en_attente'] || statut || '';
  }

  getOrderStatutLabel(statut?: string): string {
    const labels: Record<string, string> = {
      'en_attente': 'En attente',
      'en_preparation': 'En préparation',
      'pret': 'Prêt',
      'livre': 'Livré'
    };
    return labels[statut || 'en_attente'] || statut || '';
  }
}