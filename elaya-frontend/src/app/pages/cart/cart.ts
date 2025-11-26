import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { OrderService } from '../../api/order';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-page">
      <h1 class="page-title">MON <span class="gold-text">PANIER</span></h1>

      <div *ngIf="orderService.cart().length === 0" class="empty-state">
        <p>Votre panier est vide.</p>
        <a routerLink="/menu" class="btn-gold">VOIR LA CARTE</a>
      </div>

      <div *ngIf="orderService.cart().length > 0" class="cart-layout">
        <div class="cart-items">
          <div class="items-header">
            <h2>Articles ({{ orderService.getItemCount() }})</h2>
            <button (click)="clearCart()" class="text-btn">Vider</button>
          </div>
          <div *ngFor="let item of orderService.cart()" class="cart-item">
            <div class="item-info">
              <h3>{{ item.nomPlat }}</h3>
              <span class="unit-price">{{ item.prix }}€ / unité</span>
            </div>
            <div class="item-actions">
              <div class="qty-selector">
                <button (click)="decrease(item.platId)" [disabled]="item.quantite <= 1">-</button>
                <span>{{ item.quantite }}</span>
                <button (click)="increase(item.platId)">+</button>
              </div>
              <span class="item-total">{{ (item.prix * item.quantite).toFixed(2) }}€</span>
              <button (click)="remove(item.platId)" class="delete-btn">×</button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <h2>Résumé</h2>
          <div class="summary-row"><span>Sous-total</span><span>{{ orderService.getTotal().toFixed(2) }}€</span></div>
          <div class="summary-total"><span>TOTAL</span><span class="total-amount">{{ orderService.getTotal().toFixed(2) }}€</span></div>
          <button (click)="checkout()" class="checkout-btn">PASSER LA COMMANDE</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-page { padding: 4rem 5%; min-height: 100vh; background: var(--black-bg); color: var(--text-main); }
    .page-title { text-align: center; font-size: 3rem; margin-bottom: 3rem; }
    .gold-text { color: var(--gold); font-style: italic; }
    .empty-state { text-align: center; padding: 4rem; border: 1px solid #333; background: var(--card-bg); }
    .btn-gold { background: var(--gold); color: black; padding: 10px 20px; text-decoration: none; font-weight: bold; }

    .cart-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 3rem; max-width: 1200px; margin: 0 auto; }
    
    .cart-items, .cart-summary { background: var(--card-bg); padding: 2rem; border: 1px solid #333; }
    .items-header { display: flex; justify-content: space-between; border-bottom: 1px solid #333; padding-bottom: 1rem; margin-bottom: 1rem; }
    .text-btn { background: none; border: none; color: #888; cursor: pointer; text-decoration: underline; }
    
    .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 0; border-bottom: 1px solid #333; }
    .item-info h3 { margin: 0; font-size: 1.1rem; color: var(--gold); }
    .item-actions { display: flex; align-items: center; gap: 20px; }
    
    .qty-selector button { background: #222; color: white; border: none; width: 30px; height: 30px; cursor: pointer; }
    .qty-selector span { padding: 0 10px; }
    .delete-btn { background: none; border: none; color: var(--red-wax); font-size: 1.5rem; cursor: pointer; }

    .cart-summary { height: fit-content; border-top: 4px solid var(--gold); }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 1rem; color: #aaa; }
    .summary-total { display: flex; justify-content: space-between; border-top: 1px solid #333; padding-top: 1rem; font-size: 1.5rem; font-weight: bold; color: var(--gold); }
    .checkout-btn { width: 100%; padding: 15px; background: var(--gold); border: none; font-weight: bold; margin-top: 2rem; cursor: pointer; }

    /* --- RESPONSIVE --- */
    @media (max-width: 1024px) {
      .cart-layout { grid-template-columns: 1fr; gap: 2rem; }
      .cart-summary { order: -1; } /* Résumé en haut sur tablette/mobile */
    }
    @media (max-width: 768px) {
      .cart-page { padding: 2rem 1rem; }
      .cart-item { flex-direction: column; align-items: flex-start; gap: 1rem; }
      .item-actions { width: 100%; justify-content: space-between; }
    }
  `]
})
export class Cart {
  orderService = inject(OrderService);
  private router = inject(Router);
  increase(id: number) { const item = this.orderService.cart().find(i => i.platId === id); if(item) this.orderService.updateQuantity(id, item.quantite + 1); }
  decrease(id: number) { const item = this.orderService.cart().find(i => i.platId === id); if(item && item.quantite > 1) this.orderService.updateQuantity(id, item.quantite - 1); }
  remove(id: number) { if(confirm('Retirer ?')) this.orderService.removeFromCart(id); }
  clearCart() { if(confirm('Vider ?')) this.orderService.clearCart(); }
  checkout() { this.router.navigate(['/order']); }
}