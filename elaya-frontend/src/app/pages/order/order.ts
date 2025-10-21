// src/app/pages/order/order.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../api/order';
import { OrderRequest } from '../../types/order';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="order-container">
      <h1 class="order-title">COMMANDE À EMPORTER</h1>

      <!-- Empty Cart -->
      <div *ngIf="orderService.cart().length === 0" class="empty-cart">
        <p>Votre panier est vide</p>
        <button (click)="goToMenu()" class="menu-btn">
          Voir la carte
        </button>
      </div>

      <!-- Order Content -->
      <div *ngIf="orderService.cart().length > 0" class="order-content">
        
        <!-- Left: Cart Items -->
        <div class="cart-section">
          <h2 class="section-title">Votre commande</h2>
          
          <div class="cart-items">
            <div *ngFor="let item of orderService.cart()" class="cart-item">
              <div class="item-info">
                <h3 class="item-name">{{ item.nomPlat }}</h3>
                <p class="item-price">{{ item.prix }}€</p>
              </div>
              
              <div class="item-controls">
                <button (click)="decreaseQuantity(item.platId)" class="qty-btn">-</button>
                <span class="quantity">{{ item.quantite }}</span>
                <button (click)="increaseQuantity(item.platId)" class="qty-btn">+</button>
                <button (click)="removeItem(item.platId)" class="remove-btn">×</button>
              </div>
            </div>
          </div>

          <div class="cart-total">
            <span>Total</span>
            <span class="total-price">{{ orderService.getTotal().toFixed(2) }}€</span>
          </div>
        </div>

        <!-- Right: Order Form -->
        <div class="form-section">
          <h2 class="section-title">Vos informations</h2>
          
          <form (ngSubmit)="submitOrder()" #orderForm="ngForm">
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
              <label>Téléphone *</label>
              <input 
                type="tel" 
                [(ngModel)]="formData.telephone" 
                name="telephone"
                required
                class="form-input">
            </div>

            <div class="form-group">
              <label>Heure de retrait *</label>
              <select 
                [(ngModel)]="formData.heureRetrait" 
                name="heureRetrait"
                required
                class="form-input">
                <option value="">Choisir une heure</option>
                <option *ngFor="let slot of timeSlots" [value]="slot">{{ slot }}</option>
              </select>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage()" class="error-message">
              {{ errorMessage() }}
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              [disabled]="!orderForm.valid || submitting()"
              class="submit-btn">
              {{ submitting() ? 'Envoi en cours...' : 'Valider la commande' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-container {
      padding: 3rem 5rem;
      min-height: 100vh;
    }

    .order-title {
      text-align: center;
      color: #f5f1e8;
      font-size: 3rem;
      font-weight: 300;
      letter-spacing: 0.2em;
      margin-bottom: 3rem;
      font-family: Georgia, "Times New Roman", serif;
    }

    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
      color: #f5f1e8;
      font-family: Arial, Helvetica, sans-serif;
    }

    .empty-cart p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
    }

    .menu-btn {
      padding: 0.875rem 2.5rem;
      background: #d4772e;
      color: white;
      border: none;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
      cursor: pointer;
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .menu-btn:hover {
      background: #b86625;
      transform: translateY(-2px);
    }

    .order-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-title {
      color: #f5f1e8;
      font-size: 1.5rem;
      font-weight: 300;
      letter-spacing: 0.15em;
      margin-bottom: 2rem;
      font-family: Georgia, "Times New Roman", serif;
      text-align: center;
    }

    /* Cart Section */
    .cart-section {
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      padding: 2rem;
      border: 3px solid #c9984a;
    }

    .cart-items {
      margin-bottom: 2rem;
    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #d4a574;
    }

    .cart-item:last-child {
      border-bottom: none;
    }

    .item-info {
      flex: 1;
    }

    .item-name {
      font-size: 1rem;
      color: #2a2a2a;
      margin-bottom: 0.25rem;
      font-family: Georgia, "Times New Roman", serif;
    }

    .item-price {
      font-size: 0.875rem;
      color: #d4772e;
      font-weight: 600;
    }

    .item-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .qty-btn {
      width: 2rem;
      height: 2rem;
      background: #d4772e;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 1.125rem;
      transition: background 0.3s;
    }

    .qty-btn:hover {
      background: #b86625;
    }

    .quantity {
      min-width: 2rem;
      text-align: center;
      font-weight: 600;
      color: #2a2a2a;
    }

    .remove-btn {
      width: 2rem;
      height: 2rem;
      background: #c43d3d;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 1.5rem;
      margin-left: 0.5rem;
      transition: background 0.3s;
    }

    .remove-btn:hover {
      background: #a32d2d;
    }

    .cart-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 1rem 0;
      border-top: 2px solid #c9984a;
      font-size: 1.25rem;
      font-weight: 600;
      color: #2a2a2a;
      font-family: Georgia, "Times New Roman", serif;
    }

    .total-price {
      font-size: 1.75rem;
      color: #d4772e;
    }

    /* Form Section */
    .form-section {
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      padding: 2rem;
      border: 3px solid #c9984a;
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

    .error-message {
      padding: 1rem;
      background: #ffebee;
      color: #c62828;
      border-left: 4px solid #c62828;
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
      .order-container {
        padding: 2rem;
      }

      .order-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    @media (max-width: 768px) {
      .order-container {
        padding: 1.5rem 1rem;
      }

      .order-title {
        font-size: 2rem;
      }

      .cart-section,
      .form-section {
        padding: 1.5rem;
      }
    }
  `]
})
export class Order implements OnInit {
  orderService = inject(OrderService);
  private router = inject(Router);

  formData = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    heureRetrait: ''
  };

  timeSlots: string[] = [];
  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.generateTimeSlots();
  }

  generateTimeSlots(): void {
    const slots: string[] = [];
    // Horaires de retrait de 11h45 à 14h et de 18h à 22h
    const morningStart = 11.75; // 11h45
    const morningEnd = 14;
    const eveningStart = 18;
    const eveningEnd = 22;

    // Créneaux du midi
    for (let hour = morningStart; hour < morningEnd; hour += 0.25) {
      const h = Math.floor(hour);
      const m = (hour % 1) * 60;
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }

    // Créneaux du soir
    for (let hour = eveningStart; hour < eveningEnd; hour += 0.25) {
      const h = Math.floor(hour);
      const m = (hour % 1) * 60;
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }

    this.timeSlots = slots;
  }

  increaseQuantity(platId: number): void {
    const item = this.orderService.cart().find(i => i.platId === platId);
    if (item) {
      this.orderService.updateQuantity(platId, item.quantite + 1);
    }
  }

  decreaseQuantity(platId: number): void {
    const item = this.orderService.cart().find(i => i.platId === platId);
    if (item && item.quantite > 1) {
      this.orderService.updateQuantity(platId, item.quantite - 1);
    }
  }

  removeItem(platId: number): void {
    this.orderService.removeFromCart(platId);
  }

  goToMenu(): void {
    this.router.navigate(['/menu']);
  }

  submitOrder(): void {
    this.submitting.set(true);
    this.errorMessage.set(null);

    const orderRequest: OrderRequest = {
      nom: this.formData.nom,
      prenom: this.formData.prenom,
      email: this.formData.email,
      telephone: this.formData.telephone,
      plats: this.orderService.prepareOrderItems(),
      heureRetrait: this.formData.heureRetrait
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        console.log('Commande créée:', response);
        alert('Commande validée ! Vous recevrez un email de confirmation.');
        this.orderService.clearCart();
        this.router.navigate(['/']);
      },
      error: (err: Error) => {
        console.error('Erreur commande:', err);
        this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
        this.submitting.set(false);
      }
    });
  }
}