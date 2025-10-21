// src/app/pages/cart/cart.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../api/order';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-container">
      <h1 class="cart-title">MON PANIER</h1>

      <!-- Empty Cart -->
      <div *ngIf="orderService.cart().length === 0" class="empty-cart">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p>Votre panier est vide</p>
        <a routerLink="/menu" class="menu-link">Découvrir notre carte</a>
      </div>

      <!-- Cart Content -->
      <div *ngIf="orderService.cart().length > 0" class="cart-content">
        
        <!-- Cart Items -->
        <div class="cart-items-section">
          <div class="items-header">
            <h2>Articles ({{ orderService.getItemCount() }})</h2>
            <button (click)="clearCart()" class="clear-btn">Vider le panier</button>
          </div>

          <div class="cart-items">
            <div *ngFor="let item of orderService.cart()" class="cart-item">
              <div class="item-details">
                <h3 class="item-name">{{ item.nomPlat }}</h3>
                <p class="item-price-unit">{{ item.prix }}€ l'unité</p>
              </div>

              <div class="item-actions">
                <div class="quantity-controls">
                  <button 
                    (click)="decreaseQuantity(item.platId)" 
                    class="qty-btn"
                    [disabled]="item.quantite <= 1">
                    -
                  </button>
                  <span class="quantity">{{ item.quantite }}</span>
                  <button 
                    (click)="increaseQuantity(item.platId)" 
                    class="qty-btn">
                    +
                  </button>
                </div>

                <p class="item-total">{{ (item.prix * item.quantite).toFixed(2) }}€</p>

                <button 
                  (click)="removeItem(item.platId)" 
                  class="remove-btn"
                  title="Retirer du panier">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <a routerLink="/menu" class="continue-shopping">
            ← Continuer mes achats
          </a>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
          <h2>Résumé</h2>
          
          <div class="summary-line">
            <span>Sous-total</span>
            <span>{{ orderService.getTotal().toFixed(2) }}€</span>
          </div>

          <div class="summary-line total">
            <span>Total</span>
            <span>{{ orderService.getTotal().toFixed(2) }}€</span>
          </div>

          <button (click)="proceedToOrder()" class="checkout-btn">
            Passer la commande
          </button>

          <div class="payment-info">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            <p>Paiement sécurisé sur place lors du retrait</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      padding: 3rem 5rem;
      min-height: 100vh;
    }

    .cart-title {
      text-align: center;
      color: #f5f1e8;
      font-size: 3rem;
      font-weight: 300;
      letter-spacing: 0.2em;
      margin-bottom: 3rem;
      font-family: Georgia, "Times New Roman", serif;
    }

    /* Empty Cart */
    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .empty-icon {
      width: 6rem;
      height: 6rem;
      color: #d4a574;
      margin-bottom: 2rem;
    }

    .empty-cart p {
      font-size: 1.5rem;
      color: #f5f1e8;
      margin-bottom: 2rem;
      font-family: Georgia, "Times New Roman", serif;
    }

    .menu-link {
      display: inline-block;
      padding: 1rem 2.5rem;
      background: #d4772e;
      color: white;
      text-decoration: none;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .menu-link:hover {
      background: #b86625;
      transform: translateY(-2px);
    }

    /* Cart Content */
    .cart-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Items Section */
    .cart-items-section {
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      padding: 2rem;
      border: 3px solid #c9984a;
    }

    .items-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #d4a574;
    }

    .items-header h2 {
      font-size: 1.5rem;
      color: #2a2a2a;
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 400;
    }

    .clear-btn {
      padding: 0.5rem 1rem;
      background: transparent;
      color: #c43d3d;
      border: 2px solid #c43d3d;
      font-size: 0.813rem;
      font-family: Arial, Helvetica, sans-serif;
      cursor: pointer;
      transition: all 0.3s;
    }

    .clear-btn:hover {
      background: #c43d3d;
      color: white;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: white;
      border: 2px solid #d4a574;
    }

    .item-details {
      flex: 1;
    }

    .item-name {
      font-size: 1.125rem;
      color: #2a2a2a;
      margin-bottom: 0.5rem;
      font-family: Georgia, "Times New Roman", serif;
    }

    .item-price-unit {
      font-size: 0.875rem;
      color: #6a6a6a;
      font-family: Arial, Helvetica, sans-serif;
    }

    .item-actions {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
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
      font-weight: 600;
    }

    .qty-btn:hover:not(:disabled) {
      background: #b86625;
    }

    .qty-btn:disabled {
      background: #c0c0c0;
      cursor: not-allowed;
    }

    .quantity {
      min-width: 2.5rem;
      text-align: center;
      font-weight: 600;
      color: #2a2a2a;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 1rem;
    }

    .item-total {
      font-size: 1.25rem;
      font-weight: 600;
      color: #d4772e;
      font-family: Georgia, "Times New Roman", serif;
      min-width: 5rem;
      text-align: right;
    }

    .remove-btn {
      width: 2.5rem;
      height: 2.5rem;
      background: #c43d3d;
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s;
    }

    .remove-btn:hover {
      background: #a32d2d;
    }

    .remove-btn svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    .continue-shopping {
      display: inline-block;
      color: #d4772e;
      text-decoration: none;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
      transition: color 0.3s;
    }

    .continue-shopping:hover {
      color: #b86625;
    }

    /* Cart Summary */
    .cart-summary {
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      padding: 2rem;
      border: 3px solid #c9984a;
      height: fit-content;
      position: sticky;
      top: 2rem;
    }

    .cart-summary h2 {
      font-size: 1.5rem;
      color: #2a2a2a;
      margin-bottom: 2rem;
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 400;
      text-align: center;
    }

    .summary-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 0.938rem;
      color: #2a2a2a;
    }

    .summary-line.total {
      border-top: 2px solid #c9984a;
      font-size: 1.5rem;
      font-weight: 600;
      color: #d4772e;
      font-family: Georgia, "Times New Roman", serif;
      margin-top: 1rem;
      padding-top: 1.5rem;
    }

    .checkout-btn {
      width: 100%;
      padding: 1.25rem;
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
      margin-top: 2rem;
    }

    .checkout-btn:hover {
      background: #b86625;
      transform: translateY(-2px);
    }

    .payment-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding: 1rem;
      background: white;
      border-left: 3px solid #4caf50;
    }

    .payment-info .icon {
      width: 1.5rem;
      height: 1.5rem;
      color: #4caf50;
      flex-shrink: 0;
    }

    .payment-info p {
      font-size: 0.75rem;
      color: #4a4a4a;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.4;
    }

    @media (max-width: 1024px) {
      .cart-container {
        padding: 2rem;
      }

      .cart-content {
        grid-template-columns: 1fr;
      }

      .cart-summary {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .cart-container {
        padding: 1.5rem 1rem;
      }

      .cart-title {
        font-size: 2rem;
      }

      .cart-item {
        flex-direction: column;
        gap: 1rem;
      }

      .item-actions {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class Cart {
  orderService = inject(OrderService);
  private router = inject(Router);

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
    if (confirm('Voulez-vous vraiment retirer cet article du panier ?')) {
      this.orderService.removeFromCart(platId);
    }
  }

  clearCart(): void {
    if (confirm('Voulez-vous vraiment vider votre panier ?')) {
      this.orderService.clearCart();
    }
  }

  proceedToOrder(): void {
    this.router.navigate(['/order']);
  }
}