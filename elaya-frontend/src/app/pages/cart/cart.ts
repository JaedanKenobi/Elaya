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

          <a routerLink="/menu" class="continue-link">← Continuer mes achats</a>
        </div>

        <div class="cart-summary">
          <h2>Résumé</h2>
          <div class="summary-row">
            <span>Sous-total</span>
            <span>{{ orderService.getTotal().toFixed(2) }}€</span>
          </div>
          <div class="summary-total">
            <span>TOTAL</span>
            <span class="total-amount">{{ orderService.getTotal().toFixed(2) }}€</span>
          </div>
          <button (click)="checkout()" class="checkout-btn">PASSER LA COMMANDE</button>
          <p class="secure-text">🔒 Paiement sécurisé au retrait</p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .cart-page { padding: 4rem 5%; min-height: 100vh; background: var(--black-bg); color: var(--text-main); }
    .page-title { text-align: center; font-size: 3rem; margin-bottom: 3rem; }
    .gold-text { color: var(--gold); font-style: italic; }

    .empty-state { text-align: center; padding: 4rem; background: var(--card-bg); border: 1px solid #333; }
    .empty-state p { font-size: 1.2rem; margin-bottom: 2rem; color: #888; }

    .cart-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 3rem; max-width: 1200px; margin: 0 auto; }

    /* Items */
    .cart-items { background: var(--card-bg); padding: 2rem; border: 1px solid #333; }
    .items-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 1rem; margin-bottom: 1rem; }
    .items-header h2 { color: var(--gold); font-size: 1.5rem; margin: 0; }
    .text-btn { background: none; border: none; color: #888; text-decoration: underline; font-size: 0.9rem; }
    .text-btn:hover { color: var(--red-wax); }

    .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 0; border-bottom: 1px solid #333; }
    .item-info h3 { margin: 0 0 5px; font-size: 1.1rem; font-weight: 500; }
    .unit-price { color: #888; font-size: 0.9rem; }

    .item-actions { display: flex; align-items: center; gap: 20px; }
    
    .qty-selector { display: flex; align-items: center; border: 1px solid #444; border-radius: 4px; }
    .qty-selector button { background: #222; color: white; border: none; width: 30px; height: 30px; font-size: 1.2rem; }
    .qty-selector button:hover:not(:disabled) { background: var(--gold); color: black; }
    .qty-selector span { padding: 0 10px; font-weight: bold; }

    .item-total { font-family: 'Oswald'; font-size: 1.2rem; color: var(--gold); min-width: 60px; text-align: right;}
    .delete-btn { background: none; border: none; color: #666; font-size: 1.5rem; }
    .delete-btn:hover { color: var(--red-wax); }

    .continue-link { display: block; margin-top: 2rem; color: var(--text-muted); text-decoration: none; font-size: 0.9rem; }
    .continue-link:hover { color: var(--gold); }

    /* Summary */
    .cart-summary { background: var(--card-bg); padding: 2rem; border: 1px solid #333; height: fit-content; border-top: 4px solid var(--gold); }
    .cart-summary h2 { margin-top: 0; color: var(--text-main); }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 1rem; color: #aaa; }
    
    .summary-total { display: flex; justify-content: space-between; border-top: 1px solid #333; padding-top: 1rem; margin-top: 1rem; font-size: 1.5rem; color: var(--gold); font-family: 'Oswald'; font-weight: bold; }

    .btn-gold, .checkout-btn { background: var(--gold); color: black; padding: 12px 25px; text-decoration: none; display: inline-block; font-weight: bold; border: none; width: 100%; margin-top: 2rem; text-align: center; transition: 0.3s; }
    .btn-gold:hover, .checkout-btn:hover { background: white; }

    .secure-text { text-align: center; font-size: 0.8rem; color: #666; margin-top: 1rem; }

    @media(max-width:900px){ .cart-layout { grid-template-columns: 1fr; } }
  `]
})
export class Cart {
  orderService = inject(OrderService);
  private router = inject(Router);

  increase(id: number) { const item = this.orderService.cart().find(i => i.platId === id); if(item) this.orderService.updateQuantity(id, item.quantite + 1); }
  decrease(id: number) { const item = this.orderService.cart().find(i => i.platId === id); if(item && item.quantite > 1) this.orderService.updateQuantity(id, item.quantite - 1); }
  remove(id: number) { if(confirm('Retirer ?')) this.orderService.removeFromCart(id); }
  clearCart() { if(confirm('Vider le panier ?')) this.orderService.clearCart(); }
  checkout() { this.router.navigate(['/order']); }
}