import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReservationRequest, ReservationResponse } from '../../types/reservation';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="resa-container">
      <h1 class="page-title">RÉSERVER UNE <span class="gold-text">TABLE</span></h1>

      <div class="resa-content">
        
        <div class="calendar-wrapper">
          <h2 class="section-title">Choisir une date</h2>
          
          <div class="calendar">
            <div class="calendar-header">
              <button (click)="previousMonth()" class="nav-btn">‹</button>
              <span class="month-year">{{ currentMonthName() }} {{ currentYear() }}</span>
              <button (click)="nextMonth()" class="nav-btn">›</button>
            </div>

            <div class="weekdays">
              <div *ngFor="let day of weekdays" class="weekday">{{ day }}</div>
            </div>

            <div class="days">
              <div *ngFor="let day of calendarDays()" 
                   class="day"
                   [class.other-month]="!day.isCurrentMonth"
                   [class.selected]="isSelected(day)"
                   [class.today]="isToday(day)"
                   [class.disabled]="isPastDate(day)"
                   (click)="selectDate(day)">
                {{ day.date }}
              </div>
            </div>
          </div>

          <div class="date-feedback" *ngIf="formData.date">
            Date choisie : <strong>{{ formatDate(formData.date) }}</strong>
          </div>
        </div>

        <div class="form-wrapper">
          <h2 class="section-title">Vos informations</h2>
          
          <form (ngSubmit)="submitReservation()" #reservationForm="ngForm">
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
              <label>Téléphone</label>
              <input type="tel" [(ngModel)]="formData.telephone" name="telephone" required class="form-input">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="formData.email" name="email" required class="form-input">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Heure</label>
                <select [(ngModel)]="formData.heure" name="heure" required class="form-input">
                  <option value="" disabled selected>Choisir</option>
                  <option *ngFor="let slot of timeSlots" [value]="slot">{{ slot }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Couverts</label>
                <select [(ngModel)]="formData.nombrePersonnes" name="nombrePersonnes" required class="form-input">
                  <option value="" disabled selected>Nb</option>
                  <option *ngFor="let n of [1,2,3,4,5,6,7,8,9,10]" [value]="n">{{ n }} pers.</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Demande spéciale</label>
              <textarea [(ngModel)]="formData.demandeSpeciale" name="demandeSpeciale" rows="3" class="form-input textarea" placeholder="Allergies, anniversaire..."></textarea>
            </div>

            <div *ngIf="successMessage()" class="msg success">{{ successMessage() }}</div>
            <div *ngIf="errorMessage()" class="msg error">{{ errorMessage() }}</div>

            <button type="submit" [disabled]="!reservationForm.valid || !formData.date || submitting()" class="submit-btn">
              {{ submitting() ? 'TRAITEMENT...' : 'CONFIRMER LA RÉSERVATION' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .resa-container { padding: 4rem 5%; min-height: 100vh; background: var(--black-bg); }
    .page-title { text-align: center; font-size: 3rem; color: var(--text-main); margin-bottom: 3rem; }
    .gold-text { color: var(--gold); font-style: italic; }
    
    .resa-content { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; max-width: 1200px; margin: 0 auto; }
    .section-title { color: var(--gold); font-size: 1.5rem; margin-bottom: 1.5rem; text-align: center; }

    /* CALENDRIER DARK */
    .calendar-wrapper { background: var(--card-bg); padding: 2rem; border: 1px solid #333; }
    .calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; color: var(--text-main); }
    .nav-btn { background: transparent; border: 1px solid var(--gold); color: var(--gold); width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: 0.3s; }
    .nav-btn:hover { background: var(--gold); color: black; }
    .month-year { font-size: 1.2rem; font-weight: bold; text-transform: uppercase; font-family: 'Oswald'; }

    .weekdays { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 10px; }
    .weekday { text-align: center; color: var(--gold); font-size: 0.8rem; font-weight: bold; }

    .days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
    .day {
      aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
      cursor: pointer; border: 1px solid #333; color: #aaa; transition: 0.3s;
    }
    .day:hover:not(.disabled):not(.other-month) { border-color: var(--gold); color: var(--gold); }
    .day.selected { background: var(--gold); color: black; border-color: var(--gold); font-weight: bold; }
    .day.today { border: 1px solid var(--text-main); color: var(--text-main); }
    .day.other-month, .day.disabled { color: #333; cursor: default; background: #0a0a0a; }

    .date-feedback { text-align: center; margin-top: 1rem; color: var(--gold); font-style: italic; }

    /* FORMULAIRE */
    .form-wrapper { background: var(--card-bg); padding: 2rem; border: 1px solid #333; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1.2rem; }
    .form-group label { display: block; color: var(--text-muted); font-size: 0.8rem; margin-bottom: 0.4rem; font-family: 'Oswald'; }
    .form-input { width: 100%; padding: 10px; background: #111; border: 1px solid #444; color: white; outline: none; transition: 0.3s; box-sizing: border-box; }
    .form-input:focus { border-color: var(--gold); background: black; }
    
    .submit-btn { width: 100%; padding: 1rem; background: var(--gold); color: black; border: none; font-weight: bold; margin-top: 1rem; transition: 0.3s; }
    .submit-btn:hover:not(:disabled) { background: white; }
    .submit-btn:disabled { background: #333; color: #555; cursor: not-allowed; }

    .msg { padding: 10px; margin-top: 10px; text-align: center; font-size: 0.9rem; }
    .msg.success { color: var(--green-wax); border: 1px solid var(--green-wax); }
    .msg.error { color: var(--red-wax); }

    @media(max-width: 900px) { .resa-content { grid-template-columns: 1fr; } }
  `]
})
export class Reservation implements OnInit {
  private apiUrl = 'http://localhost:8000/api/reservations';
  formData = { nom: '', prenom: '', email: '', telephone: '', date: '', heure: '', nombrePersonnes: '', demandeSpeciale: '' };
  weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  timeSlots: string[] = [];
  currentMonth = signal(new Date().getMonth());
  currentYear = signal(new Date().getFullYear());
  calendarDays = signal<any[]>([]);
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void { this.generateTimeSlots(); this.generateCalendar(); }

  generateTimeSlots(): void {
    const slots = [];
    for (let h = 12; h <= 14; h++) slots.push(`${h}:00`, `${h}:30`); // Midi
    for (let h = 19; h <= 22; h++) slots.push(`${h}:00`, `${h}:30`); // Soir
    this.timeSlots = slots;
  }

  // ... (Garder la logique de calendrier existante, elle fonctionne)
  // Je simplifie ici pour l'affichage, mais garde tes méthodes generateCalendar, nextMonth etc.
  // Assure-toi juste de bien copier tes méthodes logiques existantes ici.
  generateCalendar(): void {
     const year = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(year, month, 1);
    
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    startDate.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const days: any[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      days.push({
        date: date.getDate(), month: date.getMonth(), year: date.getFullYear(),
        isCurrentMonth: date.getMonth() === month
      });
    }
    this.calendarDays.set(days);
  }

  currentMonthName(): string { return ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'][this.currentMonth()]; }
  previousMonth(): void { if(this.currentMonth()===0){this.currentMonth.set(11);this.currentYear.set(this.currentYear()-1)}else{this.currentMonth.set(this.currentMonth()-1)} this.generateCalendar(); }
  nextMonth(): void { if(this.currentMonth()===11){this.currentMonth.set(0);this.currentYear.set(this.currentYear()+1)}else{this.currentMonth.set(this.currentMonth()+1)} this.generateCalendar(); }
  
  selectDate(day: any): void {
    if (this.isPastDate(day)) return;
    const date = new Date(day.year, day.month, day.date);
    // Ajuster le fuseau horaire pour éviter le décalage
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);
    this.formData.date = date.toISOString().split('T')[0];
  }
  
  isSelected(day: any): boolean { return this.formData.date === new Date(day.year, day.month, day.date).toISOString().split('T')[0]; }
  isToday(day: any): boolean { return new Date().toDateString() === new Date(day.year, day.month, day.date).toDateString(); }
  isPastDate(day: any): boolean { return new Date(day.year, day.month, day.date) < new Date(new Date().setHours(0,0,0,0)); }
  formatDate(s: string): string { return new Date(s).toLocaleDateString(); }

  submitReservation(): void {
    this.submitting.set(true);
    const payload = { ...this.formData, nombrePersonnes: parseInt(this.formData.nombrePersonnes) };
    this.httpClient.post<ReservationResponse>(this.apiUrl, payload).subscribe({
      next: () => { this.successMessage.set('Réservation confirmée.'); this.submitting.set(false); },
      error: () => { this.errorMessage.set('Erreur serveur.'); this.submitting.set(false); }
    });
  }
}