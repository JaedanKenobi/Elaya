import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Event } from '../../types/event';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="events-container">
      <h1 class="events-title">NOS <span class="gold-text">ÉVÉNEMENTS</span></h1>

      <div *ngIf="loading()" class="status-msg">Chargement des événements...</div>
      <div *ngIf="error()" class="status-msg error">{{ error() }}</div>

      <div *ngIf="!loading() && !error()" class="events-grid">
        <div *ngFor="let event of events()" class="event-card">
          
          <div class="event-image-container">
            <img 
              [src]="event.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'" 
              [alt]="event.titre"
              class="event-image">
            <div class="event-date-badge">
              <span class="day">{{ formatDay(event.date) }}</span>
              <span class="month">{{ formatMonth(event.date) }}</span>
            </div>
          </div>
          
          <div class="event-content">
            <h3 class="event-title">{{ event.titre }}</h3>
            <p class="event-description">{{ event.description }}</p>
            
            <div class="event-footer">
              <div class="event-infos">
                <div class="info-row">
                  <span class="icon">📅</span> <span>{{ formatFullDate(event.date) }}</span>
                </div>
                <div class="info-row" *ngIf="event.lieu">
                  <span class="icon">📍</span> <span>{{ event.lieu }}</span>
                </div>
              </div>

              <button class="details-btn">RÉSERVER</button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading() && !error() && events().length === 0" class="empty-state">
        <p>Aucun événement prévu pour le moment.</p>
        <p class="small">Suivez-nous sur les réseaux pour les prochaines annonces !</p>
      </div>
    </div>
  `,
  styles: [`
    .events-container { padding: 4rem 5%; min-height: 100vh; background-color: var(--black-bg); }
    
    .events-title {
      text-align: center; color: var(--text-main); font-size: 3.5rem;
      margin-bottom: 4rem; font-weight: 700;
    }
    .gold-text { color: var(--gold); font-style: italic; font-family: 'Times New Roman', serif; }

    .events-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 3rem; max-width: 1400px; margin: 0 auto;
    }

    /* CARTE EVENT STYLE AFRO-LUXE */
    .event-card {
      background-color: var(--card-bg);
      border: 1px solid #333;
      display: flex; flex-direction: column;
      position: relative; transition: transform 0.3s, box-shadow 0.3s;
    }
    .event-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.6);
      border-color: var(--gold);
    }
    /* Bordure Wax en bas */
    .event-card::after {
      content: ''; display: block; height: 4px; width: 100%;
      background: var(--wax-border);
    }

    .event-image-container { position: relative; height: 250px; overflow: hidden; }
    .event-image { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; filter: brightness(0.8); }
    .event-card:hover .event-image { transform: scale(1.1); filter: brightness(1); }

    .event-date-badge {
      position: absolute; top: 0; right: 0;
      background: var(--gold); color: var(--black-bg);
      padding: 10px 15px; text-align: center;
      font-family: 'Oswald', sans-serif;
    }
    .day { font-size: 1.8rem; font-weight: 700; display: block; line-height: 1; }
    .month { font-size: 0.9rem; font-weight: 600; text-transform: uppercase; }

    .event-content { padding: 2rem; flex: 1; display: flex; flex-direction: column; }
    .event-title { color: var(--gold); font-size: 1.6rem; margin: 0 0 1rem; line-height: 1.2; }
    .event-description { color: #aaa; font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem; flex: 1; font-family: 'Montserrat', sans-serif; }

    .event-footer { 
      border-top: 1px solid #333; padding-top: 1.5rem; 
      display: flex; justify-content: space-between; align-items: end; 
    }
    .info-row { color: var(--text-main); font-size: 0.9rem; margin-bottom: 5px; display: flex; align-items: center; gap: 8px;}
    .icon { font-size: 1.1rem; }

    .details-btn {
      background: transparent; border: 1px solid var(--gold); color: var(--gold);
      padding: 8px 20px; font-size: 0.9rem; transition: 0.3s;
    }
    .details-btn:hover { background: var(--gold); color: var(--black-bg); }

    .status-msg { text-align: center; color: var(--gold); padding: 2rem; }
    .error { color: var(--red-wax); }
    .empty-state { text-align: center; color: #666; margin-top: 3rem; }
  `]
})
export class Events implements OnInit {
  private apiUrl = 'http://localhost:8000/api/evenements';
  events = signal<Event[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void { this.loadEvents(); }

  loadEvents(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<Event[]>(this.apiUrl).subscribe({
      next: (events) => { this.events.set(events); this.loading.set(false); },
      error: (err) => { console.error(err); this.error.set('Erreur chargement'); this.loading.set(false); }
    });
  }

  formatDay(d: string): string { return new Date(d).getDate().toString(); }
  formatMonth(d: string): string { 
    return ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][new Date(d).getMonth()]; 
  }
  formatFullDate(d: string): string { 
    return new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); 
  }
}