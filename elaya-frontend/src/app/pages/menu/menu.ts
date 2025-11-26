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
        <h1 class="page-title">NOTRE <span class="gold-text">CARTE</span></h1>
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

      <div *ngIf="loading()" class="status-msg">Chargement...</div>
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
            <p class="dish-desc">{{ dish.description || 'Délicieux plat maison.' }}</p>
            <div class="card-footer">
              <span class="tag" *ngIf="dish.categorie">{{ dish.categorie }}</span>
              <button class="add-btn" (click)="addToCart(dish)" [disabled]="!dish.disponible">+</button>
            </div>
          </div>
        </article>
      </div>
    </div>
  `,
  styles: [`
    .menu-page { padding-bottom: 5rem; min-height: 100vh; background: var(--black-bg);}
    .menu-header { text-align: center; padding: 4rem 1rem 3rem; background: linear-gradient(to bottom, #111, var(--black-bg)); }
    .page-title { font-size: 3.5rem; color: var(--text-main); margin: 0; }
    .gold-text { color: var(--gold); font-style: italic; }
    .subtitle { color: var(--text-muted); margin-bottom: 2rem; }

    .filters { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
    .filter-btn {
      background: transparent; border: 1px solid #333; color: var(--text-muted);
      padding: 10px 25px; border-radius: 50px; font-size: 0.85rem; transition: 0.3s;
    }
    .filter-btn:hover, .filter-btn.active { border-color: var(--gold); color: var(--gold); }

    .menu-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 40px; padding: 0 5%; max-width: 1400px; margin: 0 auto;
    }

    .card {
      background-color: var(--card-bg); border: 1px solid #222; position: relative;
      transition: transform 0.3s;
    }
    .card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--wax-border); z-index: 1; }
    .card:hover { transform: translateY(-5px); border-color: var(--gold); }

    .card-image-box { height: 200px; overflow: hidden; }
    .card-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.9); }
    .card-content { padding: 20px 20px 20px 30px; }
    .card-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .dish-title { color: var(--gold); margin: 0; font-size: 1.3rem; }
    .dish-price { color: var(--text-main); font-weight: 700; font-family: 'Oswald'; }
    .dish-desc { color: #888; font-size: 0.9rem; margin-bottom: 20px; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #333; padding-top: 15px; }
    .tag { color: var(--green-wax); font-size: 0.8rem; text-transform: uppercase; font-weight: bold;}
    .add-btn { background: var(--gold); border: none; width: 35px; height: 35px; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
    .add-btn:hover { background: white; }

    /* --- RESPONSIVE --- */
    @media (max-width: 1024px) { .menu-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 768px) {
      .page-title { font-size: 2.5rem; }
      .filters { overflow-x: auto; justify-content: start; padding-bottom: 10px; flex-wrap: nowrap; }
      .menu-grid { grid-template-columns: 1fr; gap: 2rem; }
    }
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
      error: (e) => { this.error.set('Erreur'); this.loading.set(false); }
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
    alert('Ajouté au panier');
  }
}