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
    <div class="order-page">
      <h1 class="page-title">VALIDATION <span class="gold-text">COMMANDE</span></h1>

      <div class="order-layout">
        
        <div class="order-recap">
          <h2>Votre sélection</h2>
          <div *ngFor="let item of orderService.cart()" class="mini-item">
            <span>{{ item.quantite }}x {{ item.nomPlat }}</span>
            <span class="price">{{ (item.prix * item.quantite).toFixed(2) }}€</span>
          </div>
          <div class="total-row">
            <span>TOTAL À RÉGLER</span>
            <span>{{ orderService.getTotal().toFixed(2) }}€</span>
          </div>
        </div>

        <div class="order-form-wrapper">
          <h2>Vos Coordonnées</h2>
          <form (ngSubmit)="submitOrder()" #orderForm="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label>Prénom</label>
                <input type="text" [(ngModel)]="formData.prenom" name="prenom" required class="form-input">
              </div>
              <div class="form-group">
                <label>Nom</label>
                <input type="text" [(ngModel)]="formData.nom" name="nom" required class="form-input">
              </div>
            </div>

            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="formData.email" name="email" required class="form-input">
            </div>
            <div class="form-group">
              <label>Téléphone</label>
              <input type="tel" [(ngModel)]="formData.telephone" name="telephone" required class="form-input">
            </div>

            <div class="form-group">
              <label>Heure de retrait souhaitée</label>
              <select [(ngModel)]="formData.heureRetrait" name="heureRetrait" required class="form-input">
                <option value="" disabled selected>Choisir</option>
                <option *ngFor="let slot of timeSlots" [value]="slot">{{ slot }}</option>
              </select>
            </div>

            <div *ngIf="errorMessage()" class="error-msg">{{ errorMessage() }}</div>

            <button type="submit" [disabled]="!orderForm.valid || submitting()" class="submit-btn">
              {{ submitting() ? 'VALIDATION...' : 'COMMANDER & PAYER AU RETRAIT' }}
            </button>
          </form>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .order-page { padding: 4rem 5%; min-height: 100vh; background: var(--black-bg); color: var(--text-main); }
    .page-title { text-align: center; font-size: 3rem; margin-bottom: 3rem; }
    .gold-text { color: var(--gold); font-style: italic; }

    .order-layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 3rem; max-width: 1100px; margin: 0 auto; }

    /* RECAP GAUCHE */
    .order-recap { background: #111; padding: 2rem; border: 1px solid #333; height: fit-content; }
    .order-recap h2 { color: var(--gold); font-size: 1.3rem; border-bottom: 1px solid #333; padding-bottom: 1rem; margin-bottom: 1rem; }
    .mini-item { display: flex; justify-content: space-between; margin-bottom: 0.8rem; color: #ccc; font-size: 0.95rem; }
    .price { color: var(--gold); font-family: 'Oswald'; }
    .total-row { display: flex; justify-content: space-between; border-top: 1px solid #333; padding-top: 1rem; margin-top: 1rem; font-size: 1.2rem; font-weight: bold; color: var(--text-main); }

    /* FORMULAIRE DROITE */
    .order-form-wrapper { background: var(--card-bg); padding: 2.5rem; border: 1px solid #333; border-top: 4px solid var(--green-wax); }
    .order-form-wrapper h2 { color: var(--text-main); margin-top: 0; margin-bottom: 1.5rem; }
    
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1.2rem; }
    .form-group label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 5px; font-family: 'Oswald'; letter-spacing: 1px; }
    .form-input { width: 100%; padding: 12px; background: #050505; border: 1px solid #444; color: white; outline: none; transition: 0.3s; box-sizing: border-box; }
    .form-input:focus { border-color: var(--gold); }

    .submit-btn { width: 100%; padding: 1.2rem; background: var(--green-wax); color: white; border: none; font-weight: bold; font-size: 1rem; margin-top: 1.5rem; transition: 0.3s; }
    .submit-btn:hover:not(:disabled) { background: #007d2a; }
    .submit-btn:disabled { background: #333; cursor: not-allowed; }

    .error-msg { color: var(--red-wax); text-align: center; margin-top: 1rem; }

    @media(max-width:800px){ .order-layout { grid-template-columns: 1fr; } }
  `]
})
export class Order implements OnInit {
  orderService = inject(OrderService);
  private router = inject(Router);
  formData = { nom: '', prenom: '', email: '', telephone: '', heureRetrait: '' };
  timeSlots: string[] = [];
  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    // Générer créneaux horaires (Midi + Soir)
    for(let h=11; h<=13; h++) [0,15,30,45].forEach(m => this.timeSlots.push(`${h}:${m.toString().padStart(2,'0')}`));
    for(let h=18; h<=21; h++) [0,15,30,45].forEach(m => this.timeSlots.push(`${h}:${m.toString().padStart(2,'0')}`));
  }

  submitOrder(): void {
    this.submitting.set(true);
    const req: OrderRequest = { ...this.formData, plats: this.orderService.prepareOrderItems() };
    
    this.orderService.createOrder(req).subscribe({
      next: () => { alert('Commande validée !'); this.orderService.clearCart(); this.router.navigate(['/']); },
      error: () => { this.errorMessage.set('Erreur serveur'); this.submitting.set(false); }
    });
  }
}