// src/app/api/order.ts

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order, OrderRequest, OrderResponse, OrderItem } from '../types/order';

// Interface étendue pour le panier (avec infos du plat)
export interface CartItem extends OrderItem {
  nomPlat: string;
  prix: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8000/api/commandes';

  // Gestion du panier avec signals (nouvelle convention Angular)
  cart = signal<CartItem[]>([]);

  // Signal computed pour le total
  total = computed(() => {
    return this.cart().reduce((sum, item) => sum + (item.prix * item.quantite), 0);
  });

  // Signal computed pour le nombre d'articles
  itemCount = computed(() => {
    return this.cart().reduce((count, item) => count + item.quantite, 0);
  });

  constructor(private http: HttpClient) {}

  // --- Gestion du panier (local) ---
  
  addToCart(platId: number, nomPlat: string, prix: number, quantite: number = 1): void {
    const currentCart = this.cart();
    const existingItem = currentCart.find(i => i.platId === platId);
    
    if (existingItem) {
      existingItem.quantite += quantite;
      this.cart.set([...currentCart]);
    } else {
      this.cart.set([...currentCart, { platId, nomPlat, prix, quantite }]);
    }
  }

  removeFromCart(platId: number): void {
    this.cart.set(this.cart().filter(item => item.platId !== platId));
  }

  updateQuantity(platId: number, quantite: number): void {
    if (quantite <= 0) {
      this.removeFromCart(platId);
      return;
    }
    
    const currentCart = this.cart();
    const item = currentCart.find(i => i.platId === platId);
    if (item) {
      item.quantite = quantite;
      this.cart.set([...currentCart]);
    }
  }

  clearCart(): void {
    this.cart.set([]);
  }

  getTotal(): number {
    return this.total();
  }

  getItemCount(): number {
    return this.itemCount();
  }

  // Préparer les données pour l'API (sans nomPlat et prix)
  prepareOrderItems(): OrderItem[] {
    return this.cart().map(item => ({
      platId: item.platId,
      quantite: item.quantite
    }));
  }

  // --- Appels API ---
  
  createOrder(data: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}`, data)
      .pipe(catchError(this.handleError));
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur API Commande :', error);
    return throwError(() => new Error('Erreur lors du traitement de la commande.'));
  }
}