import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="hero">
      <div class="hero-content">
        <h1 class="hero-title">L'Afrique, <br><span class="gold-text">Sublimée.</span></h1>
        <p class="hero-desc">
          Une expérience gastronomique unique à Thiers. 
          Découvrez l'alliance parfaite entre tradition ancestrale et élégance moderne.
        </p>
        <div class="hero-btns">
          <a routerLink="/menu" class="btn btn-gold">Voir la Carte</a>
          <a routerLink="/reservation" class="btn btn-outline">Réserver</a>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80" alt="Plat signature Elaya">
      </div>
    </header>
  `,
  styles: [`
    .hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4rem 5%;
      min-height: 80vh;
      background: radial-gradient(circle at top right, #1a1a1a 0%, var(--black-bg) 70%);
      max-width: 1400px;
      margin: 0 auto;
    }
    .hero-content { flex: 1; padding-right: 2rem; }
    
    .hero-title {
      font-size: 4rem;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      color: var(--text-main);
    }
    .gold-text { color: var(--gold); font-style: italic; font-family: 'Playfair Display', serif; }
    
    .hero-desc {
      color: var(--text-muted);
      font-size: 1.1rem;
      line-height: 1.6;
      max-width: 500px;
      margin-bottom: 2.5rem;
      border-left: 3px solid var(--green-wax);
      padding-left: 1.5rem;
    }
    
    .hero-btns { display: flex; gap: 1rem; }
    
    .btn {
      padding: 12px 30px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: 0.3s;
    }
    .btn-gold { background: var(--gold); color: var(--black-bg); border: 1px solid var(--gold); }
    .btn-gold:hover { background: var(--gold-hover); }
    
    .btn-outline { background: transparent; color: var(--gold); border: 1px solid var(--gold); }
    .btn-outline:hover { background: rgba(253, 203, 88, 0.1); }

    .hero-image { flex: 1; display: flex; justify-content: center; }
    .hero-image img {
      width: 100%;
      max-width: 500px;
      border-radius: 50%;
      border: 2px solid var(--gold);
      box-shadow: 0 0 40px rgba(0,0,0,0.5);
      aspect-ratio: 1/1;
      object-fit: cover;
    }

    @media(max-width: 768px) {
      .hero { flex-direction: column-reverse; text-align: center; padding-top: 2rem; }
      .hero-content { padding-right: 0; margin-top: 2rem; }
      .hero-desc { margin: 0 auto 2rem; border-left: none; border-bottom: 3px solid var(--green-wax); padding-bottom: 1rem; padding-left: 0;}
      .hero-btns { justify-content: center; }
      .hero-title { font-size: 3rem; }
    }
  `]
})
export class Home {}