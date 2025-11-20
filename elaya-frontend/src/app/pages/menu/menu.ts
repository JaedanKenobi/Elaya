// src/app/pages/menu/menu.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../api/menu';
import { OrderService } from '../../api/order';
import { Dish } from '../../types/dish';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="menu-page">
      <div class="menu-header">
        <h1 class="page-title">Notre <span class="gold-text">Carte</span></h1>
        <p class="subtitle">Saveurs d'exception & Produits frais</p>
        
        <div class="filters">
          <button *ngFor="let cat of categories" 
                  class="filter-btn" 
                  [class.active]="selectedCategory() === cat"
                  (click)="selectCategory(cat)">
            {{ cat }}
          </button>
        </div>
      </div>

      <div *ngIf="loading()" class="status-msg">Chargement des délices...</div>
      <div *ngIf="error()" class="status-msg error">{{ error() }}</div>

      <div class="menu-grid" *ngIf="!loading()">
        <article *ngFor="let dish of filteredDishes()" class="card">
          <div class="card-image-box">
            <img [src]="dish.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500'" 
                 [alt]="dish.nom" class="card-img">
          </div>

          <div class="card-content">
            <div class="card-header">
              <h3 class="dish-title">{{ dish.nom }}</h3>
              <span class="dish-price">{{ dish.prix }} €</span>
            </div>
            
            <p class="dish-desc">{{ dish.description || 'Une saveur unique à découvrir.' }}</p>
            
            <div class="card-footer">
              <span class="tag" *ngIf="dish.categorie">{{ dish.categorie }}</span>
              
              <button class="add-btn" 
                      (click)="addToCart(dish)" 
                      [disabled]="!dish.disponible">
                {{ dish.disponible ? '+' : 'X' }}
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  `,
  styles: [`
    .menu-page { padding-bottom: 5rem; }
    .menu-header { text-align: center; padding: 4rem 1rem 3rem; background: linear-gradient(to bottom, #151515, var(--black-bg)); }
    
    .page-title { font-size: 3.5rem; color: var(--text-main); margin: 0; }
    .gold-text { color: var(--gold); font-style: italic; font-family: 'Times New Roman', serif; }
    .subtitle { color: var(--text-muted); margin-top: 0.5rem; margin-bottom: 2.5rem; }

    /* FILTRES */
    .filters { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
    .filter-btn {
      background: transparent;
      border: 1px solid #333;
      color: var(--text-muted);
      padding: 10px 25px;
      border-radius: 50px;
      font-size: 0.85rem;
      transition: 0.3s;
    }
    .filter-btn:hover, .filter-btn.active {
      border-color: var(--gold);
      color: var(--gold);
      background: rgba(253, 203, 88, 0.05);
    }

    /* GRILLE */
    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 40px;
      padding: 0 5%;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* CARTE AFRO-LUXE */
    .card {
      background-color: var(--card-bg);
      position: relative;
      transition: transform 0.3s, box-shadow 0.3s;
      border: 1px solid #222;
    }
    .card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.5);
      border-color: var(--gold);
    }
    /* BORDURE WAX LATÉRALE */
    .card::before {
      content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
      background: var(--wax-border);
      z-index: 1;
    }

    .card-image-box { height: 220px; overflow: hidden; width: 100%; }
    .card-img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; filter: brightness(0.9); }
    .card:hover .card-img { transform: scale(1.1); filter: brightness(1); }

    .card-content { padding: 25px 25px 25px 35px; /* Marge à gauche pour la bordure wax */ }

    .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
    .dish-title { color: var(--gold); margin: 0; font-size: 1.4rem; font-weight: 500; line-height: 1.2; }
    .dish-price { color: var(--text-main); font-weight: 700; font-size: 1.3rem; font-family: 'Oswald'; }

    .dish-desc { color: #888; font-size: 0.9rem; line-height: 1.6; margin-bottom: 20px; min-height: 3em; }

    .card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #333; padding-top: 15px; }
    .tag { color: var(--green-wax); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

    .add-btn {
      background: var(--gold); color: var(--black-bg); border: none;
      width: 40px; height: 40px; font-size: 1.5rem;
      display: flex; align-items: center; justify-content: center;
      transition: 0.2s;
    }
    .add-btn:hover:not(:disabled) { background: var(--text-main); }
    .add-btn:disabled { background: #444; color: #888; cursor: not-allowed; }

    .status-msg { text-align: center; color: var(--gold); padding: 2rem; font-size: 1.2rem; }
    .error { color: var(--red-wax); }
  `]
})
export class Menu implements OnInit {
  private menuService = inject(MenuService);
  private orderService = inject(OrderService);

  dishes = signal<Dish[]>([]);
  selectedCategory = signal<string>('Tous');
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  categories = ['Tous', 'Entrée', 'Plat', 'Dessert', 'Boisson'];

  ngOnInit(): void { this.loadDishes(); }

  loadDishes(): void {
    this.loading.set(true);
    this.menuService.getAllDishes().subscribe({
      next: (d) => { this.dishes.set(d); this.loading.set(false); },
      error: (e) => { this.error.set('Erreur chargement'); this.loading.set(false); }
    });
  }

  selectCategory(cat: string): void { this.selectedCategory.set(cat); }

  filteredDishes(): Dish[] {
    const cat = this.selectedCategory();
    if (cat === 'Tous') return this.dishes();
    return this.dishes().filter(d => d.categorie?.toLowerCase().includes(cat.toLowerCase()));
  }

  addToCart(dish: Dish): void {
    if (!dish.id) return;
    this.orderService.addToCart(dish.id, dish.nom, dish.prix, 1);
    alert(`${dish.nom} ajouté !`); // Tu pourras remplacer par un "Toast" plus joli plus tard
  }
}