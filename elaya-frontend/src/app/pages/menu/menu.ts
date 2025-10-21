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
    <div class="menu-container">
      <h1 class="menu-title">NOTRE CARTE</h1>
      
      <!-- Category Filters -->
      <div class="category-filters">
        <button 
          *ngFor="let cat of categories" 
          [class.active]="selectedCategory() === cat"
          (click)="selectCategory(cat)"
          class="category-btn">
          {{ cat }}
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="loading">
        <p>Chargement des plats...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error()" class="error">
        <p>{{ error() }}</p>
      </div>

      <!-- Dishes Grid -->
      <div *ngIf="!loading() && !error()" class="dishes-grid">
        <div *ngFor="let dish of filteredDishes()" class="dish-card">
          <div class="dish-image-container">
            <img 
              [src]="dish.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400'" 
              [alt]="dish.nom"
              class="dish-image">
          </div>
          
          <div class="dish-content">
            <h3 class="dish-name">{{ dish.nom }}</h3>
            <p class="dish-description" *ngIf="dish.description">{{ dish.description }}</p>
            
            <div class="dish-footer">
              <span class="dish-price">{{ dish.prix }}€</span>
              <button 
                (click)="addToCart(dish)"
                [disabled]="!dish.disponible"
                class="add-btn">
                {{ dish.disponible ? 'Ajouter' : 'Indisponible' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading() && !error() && filteredDishes().length === 0" class="empty-state">
        <p>Aucun plat disponible dans cette catégorie.</p>
      </div>
    </div>
  `,
  styles: [`
    .menu-container {
      padding: 3rem 5rem;
      min-height: 100vh;
    }

    .menu-title {
      text-align: center;
      color: #f5f1e8;
      font-size: 3rem;
      font-weight: 300;
      letter-spacing: 0.2em;
      margin-bottom: 3rem;
      font-family: Georgia, "Times New Roman", serif;
    }

    .category-filters {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .category-btn {
      padding: 0.75rem 2rem;
      background: transparent;
      border: 2px solid #c9984a;
      color: #f5f1e8;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
      cursor: pointer;
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .category-btn:hover,
    .category-btn.active {
      background: #c9984a;
      color: #1a2a1a;
    }

    .dishes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2.5rem;
      margin-top: 2rem;
    }

    .dish-card {
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      border: 3px solid #c9984a;
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .dish-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(201, 152, 74, 0.3);
    }

    .dish-image-container {
      width: 100%;
      height: 220px;
      overflow: hidden;
      background: #1a1a1a;
      border-bottom: 2px solid #8b7355;
    }

    .dish-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .dish-card:hover .dish-image {
      transform: scale(1.05);
    }

    .dish-content {
      padding: 1.5rem;
    }

    .dish-name {
      font-size: 1.25rem;
      color: #2a2a2a;
      margin-bottom: 0.75rem;
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 400;
    }

    .dish-description {
      font-size: 0.813rem;
      color: #4a4a4a;
      line-height: 1.6;
      margin-bottom: 1rem;
      font-family: Arial, Helvetica, sans-serif;
      min-height: 3rem;
    }

    .dish-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.25rem;
      padding-top: 1rem;
      border-top: 1px solid #d4a574;
    }

    .dish-price {
      font-size: 1.5rem;
      color: #d4772e;
      font-weight: 600;
      font-family: Georgia, "Times New Roman", serif;
    }

    .add-btn {
      padding: 0.625rem 1.5rem;
      background: #d4772e;
      color: white;
      border: none;
      font-size: 0.813rem;
      font-family: Arial, Helvetica, sans-serif;
      cursor: pointer;
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .add-btn:hover:not(:disabled) {
      background: #b86625;
      transform: translateY(-2px);
    }

    .add-btn:disabled {
      background: #8a8a8a;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .loading,
    .error,
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #f5f1e8;
      font-family: Arial, Helvetica, sans-serif;
    }

    .error {
      color: #ff6b6b;
    }

    @media (max-width: 1024px) {
      .menu-container {
        padding: 2rem 2rem;
      }

      .dishes-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
      }
    }

    @media (max-width: 768px) {
      .menu-container {
        padding: 2rem 1rem;
      }

      .menu-title {
        font-size: 2rem;
      }

      .dishes-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .category-filters {
        gap: 0.75rem;
      }

      .category-btn {
        padding: 0.5rem 1rem;
        font-size: 0.75rem;
      }
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

  ngOnInit(): void {
    this.loadDishes();
  }

  loadDishes(): void {
    this.loading.set(true);
    this.error.set(null);

    this.menuService.getAllDishes().subscribe({
      next: (dishes: Dish[]) => {
        this.dishes.set(dishes);
        this.loading.set(false);
      },
      error: (err: Error) => {
        console.error('Erreur lors du chargement des plats:', err);
        this.error.set('Impossible de charger les plats. Veuillez réessayer.');
        this.loading.set(false);
      }
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  filteredDishes(): Dish[] {
    const category = this.selectedCategory();
    if (category === 'Tous') {
      return this.dishes();
    }
    
    return this.dishes().filter(dish => {
      if (!dish.categorie) return false;
      return dish.categorie.toLowerCase() === category.toLowerCase() ||
             dish.categorie.toLowerCase().includes(category.toLowerCase());
    });
  }

  addToCart(dish: Dish): void {
    if (!dish.id) return;
    
    // Ajouter au panier avec OrderService
    this.orderService.addToCart(dish.id, dish.nom, dish.prix, 1);
    
    console.log('Ajouté au panier:', dish.nom);
    alert(`${dish.nom} ajouté au panier !`);
  }
}