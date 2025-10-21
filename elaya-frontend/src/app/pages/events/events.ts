// src/app/pages/events/events.ts

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
      <h1 class="events-title">ÉVÉNEMENTS</h1>

      <!-- Loading State -->
      <div *ngIf="loading()" class="loading">
        <p>Chargement des événements...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error()" class="error">
        <p>{{ error() }}</p>
      </div>

      <!-- Events Grid -->
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
              <div class="event-info">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{{ formatFullDate(event.date) }}</span>
              </div>
              
              <div class="event-info" *ngIf="event.lieu">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{{ event.lieu }}</span>
              </div>

              <button class="details-btn">
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading() && !error() && events().length === 0" class="empty-state">
        <p>Aucun événement prévu pour le moment.</p>
        <p class="small">Revenez bientôt pour découvrir nos prochains événements !</p>
      </div>
    </div>
  `,
  styles: [`
    .events-container {
      padding: 3rem 5rem;
      min-height: 100vh;
    }

    .events-title {
      text-align: center;
      color: #f5f1e8;
      font-size: 3rem;
      font-weight: 300;
      letter-spacing: 0.2em;
      margin-bottom: 3rem;
      font-family: Georgia, "Times New Roman", serif;
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

    .empty-state .small {
      font-size: 0.875rem;
      opacity: 0.7;
      margin-top: 0.5rem;
    }

    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .event-card {
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      border: 3px solid #c9984a;
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
      display: flex;
      flex-direction: column;
    }

    .event-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 35px rgba(201, 152, 74, 0.4);
    }

    .event-image-container {
      position: relative;
      width: 100%;
      height: 250px;
      overflow: hidden;
      background: #1a1a1a;
      border-bottom: 3px solid #8b7355;
    }

    .event-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }

    .event-card:hover .event-image {
      transform: scale(1.1);
    }

    .event-date-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, #d4772e 0%, #c9984a 100%);
      color: white;
      padding: 0.75rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 2px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .day {
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1;
      font-family: Arial, Helvetica, sans-serif;
    }

    .month {
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 0.25rem;
      font-family: Arial, Helvetica, sans-serif;
    }

    .event-content {
      padding: 1.75rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .event-title {
      font-size: 1.5rem;
      color: #2a2a2a;
      margin-bottom: 1rem;
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 400;
      line-height: 1.3;
    }

    .event-description {
      font-size: 0.875rem;
      color: #4a4a4a;
      line-height: 1.7;
      margin-bottom: 1.5rem;
      flex: 1;
      font-family: Arial, Helvetica, sans-serif;
    }

    .event-footer {
      border-top: 2px solid #d4a574;
      padding-top: 1rem;
    }

    .event-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #6a6a6a;
      font-size: 0.813rem;
      margin-bottom: 0.75rem;
      font-family: Arial, Helvetica, sans-serif;
    }

    .icon {
      width: 1rem;
      height: 1rem;
      color: #d4772e;
      flex-shrink: 0;
    }

    .details-btn {
      width: 100%;
      padding: 0.875rem;
      background: #d4772e;
      color: white;
      border: none;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
      cursor: pointer;
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
      margin-top: 1rem;
    }

    .details-btn:hover {
      background: #b86625;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(212, 119, 46, 0.3);
    }

    @media (max-width: 1024px) {
      .events-container {
        padding: 2rem;
      }

      .events-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
      }
    }

    @media (max-width: 768px) {
      .events-container {
        padding: 1.5rem 1rem;
      }

      .events-title {
        font-size: 2rem;
      }

      .events-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }
  `]
})
export class Events implements OnInit {
  private apiUrl = 'http://localhost:8000/api/evenements';

  events = signal<Event[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<Event[]>(this.apiUrl).subscribe({
      next: (events: Event[]) => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: (err: Error) => {
        console.error('Erreur lors du chargement des événements:', err);
        this.error.set('Impossible de charger les événements. Veuillez réessayer.');
        this.loading.set(false);
      }
    });
  }

  formatDay(dateStr: string): string {
    const date = new Date(dateStr);
    return date.getDate().toString();
  }

  formatMonth(dateStr: string): string {
    const date = new Date(dateStr);
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 
                    'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    return months[date.getMonth()];
  }

  formatFullDate(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('fr-FR', options);
  }
}