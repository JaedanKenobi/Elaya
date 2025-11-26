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
      <h1 class="page-title">NOS <span class="gold-text">ÉVÉNEMENTS</span></h1>
      <div *ngIf="events().length === 0" class="empty-state"><p>Aucun événement pour le moment.</p></div>
      <div class="events-grid">
        <div *ngFor="let event of events()" class="event-card">
          <div class="event-image"><img [src]="event.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'" [alt]="event.titre"></div>
          <div class="event-content">
            <h3>{{ event.titre }}</h3>
            <p>{{ event.description }}</p>
            <div class="event-footer"><span>{{ formatFullDate(event.date) }}</span></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .events-container { padding: 4rem 5%; min-height: 100vh; background: var(--black-bg); color: var(--text-main); }
    .page-title { text-align: center; font-size: 3rem; margin-bottom: 3rem; }
    .gold-text { color: var(--gold); font-style: italic; }
    .empty-state { text-align: center; color: #666; }

    .events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 3rem; max-width: 1400px; margin: 0 auto; }
    
    .event-card { background: var(--card-bg); border: 1px solid #333; overflow: hidden; transition: 0.3s; }
    .event-card:hover { transform: translateY(-5px); border-color: var(--gold); }
    .event-image { height: 200px; overflow: hidden; }
    .event-image img { width: 100%; height: 100%; object-fit: cover; }
    .event-content { padding: 1.5rem; }
    .event-content h3 { color: var(--gold); margin: 0 0 1rem; font-size: 1.5rem; }
    .event-footer { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #333; color: #888; }

    /* --- RESPONSIVE --- */
    @media (max-width: 768px) {
      .events-grid { grid-template-columns: 1fr; }
      .page-title { font-size: 2rem; }
    }
  `]
})
export class Events implements OnInit {
  private apiUrl = 'http://localhost:8000/api/evenements';
  events = signal<Event[]>([]);
  loading = signal<boolean>(true);
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http.get<Event[]>(this.apiUrl).subscribe({ next: (e) => this.events.set(e) });
  }
  formatFullDate(d: string): string { return new Date(d).toLocaleDateString(); }
}