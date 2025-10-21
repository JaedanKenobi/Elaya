// src/app/pages/reservation/reservation.ts

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
    <div class="reservation-container">
      <h1 class="reservation-title">RÉSERVATION</h1>

      <div class="reservation-content">
        
        <!-- Left: Calendar -->
        <div class="calendar-section">
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
              <div 
                *ngFor="let day of calendarDays()" 
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

          <div class="selected-date-display" *ngIf="formData.date">
            <p>Date sélectionnée : <strong>{{ formatDate(formData.date) }}</strong></p>
          </div>
        </div>

        <!-- Right: Form -->
        <div class="form-section">
          <h2 class="section-title">Vos informations</h2>
          
          <form (ngSubmit)="submitReservation()" #reservationForm="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label>Prénom *</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.prenom" 
                  name="prenom"
                  required
                  class="form-input">
              </div>

              <div class="form-group">
                <label>Nom *</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.nom" 
                  name="nom"
                  required
                  class="form-input">
              </div>
            </div>

            <div class="form-group">
              <label>Email *</label>
              <input 
                type="email" 
                [(ngModel)]="formData.email" 
                name="email"
                required
                class="form-input">
            </div>

            <div class="form-group">
              <label>Téléphone *</label>
              <input 
                type="tel" 
                [(ngModel)]="formData.telephone" 
                name="telephone"
                required
                class="form-input">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Heure *</label>
                <select 
                  [(ngModel)]="formData.heure" 
                  name="heure"
                  required
                  class="form-input">
                  <option value="">Choisir</option>
                  <option *ngFor="let slot of timeSlots" [value]="slot">{{ slot }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Nombre de personnes *</label>
                <select 
                  [(ngModel)]="formData.nombrePersonnes" 
                  name="nombrePersonnes"
                  required
                  class="form-input">
                  <option value="">Choisir</option>
                  <option *ngFor="let n of [1,2,3,4,5,6,7,8,9,10]" [value]="n">{{ n }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Demande spéciale</label>
              <textarea 
                [(ngModel)]="formData.demandeSpeciale" 
                name="demandeSpeciale"
                rows="4"
                placeholder="Allergies, occasion spéciale, préférence de table..."
                class="form-input textarea"></textarea>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage()" class="error-message">
              {{ errorMessage() }}
            </div>

            <!-- Success Message -->
            <div *ngIf="successMessage()" class="success-message">
              {{ successMessage() }}
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              [disabled]="!reservationForm.valid || !formData.date || submitting()"
              class="submit-btn">
              {{ submitting() ? 'Envoi en cours...' : 'Réserver' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reservation-container {
      padding: 3rem 5rem;
      min-height: 100vh;
    }

    .reservation-title {
      text-align: center;
      color: #f5f1e8;
      font-size: 3rem;
      font-weight: 300;
      letter-spacing: 0.2em;
      margin-bottom: 3rem;
      font-family: Georgia, "Times New Roman", serif;
    }

    .reservation-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-title {
      color: #2a2a2a;
      font-size: 1.25rem;
      font-weight: 400;
      letter-spacing: 0.1em;
      margin-bottom: 1.5rem;
      font-family: Georgia, "Times New Roman", serif;
      text-align: center;
    }

    /* Calendar Section */
    .calendar-section {
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      padding: 2rem;
      border: 3px solid #c9984a;
    }

    .calendar {
      background: white;
      padding: 1.5rem;
      border: 2px solid #d4a574;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .nav-btn {
      background: #d4772e;
      color: white;
      border: none;
      width: 2rem;
      height: 2rem;
      cursor: pointer;
      font-size: 1.5rem;
      transition: background 0.3s;
    }

    .nav-btn:hover {
      background: #b86625;
    }

    .month-year {
      font-size: 1rem;
      font-weight: 600;
      color: #2a2a2a;
      font-family: Arial, Helvetica, sans-serif;
    }

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .weekday {
      text-align: center;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6a6a6a;
      padding: 0.5rem 0;
      font-family: Arial, Helvetica, sans-serif;
    }

    .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.5rem;
    }

    .day {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid #e0e0e0;
      transition: all 0.3s;
      font-size: 0.875rem;
      color: #2a2a2a;
      font-family: Arial, Helvetica, sans-serif;
    }

    .day:hover:not(.disabled):not(.other-month) {
      background: #f0e8d8;
      border-color: #d4a574;
    }

    .day.other-month {
      color: #c0c0c0;
      cursor: default;
    }

    .day.selected {
      background: #d4772e;
      color: white;
      border-color: #d4772e;
      font-weight: 600;
    }

    .day.today {
      border: 2px solid #d4772e;
      font-weight: 600;
    }

    .day.disabled {
      color: #d0d0d0;
      cursor: not-allowed;
      background: #f5f5f5;
    }

    .selected-date-display {
      margin-top: 1.5rem;
      padding: 1rem;
      background: white;
      border: 2px solid #d4772e;
      text-align: center;
      color: #2a2a2a;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 0.875rem;
    }

    .selected-date-display strong {
      color: #d4772e;
    }

    /* Form Section */
    .form-section {
      background: linear-gradient(to bottom, #f5f1e8 0%, #ebe6dc 100%);
      padding: 2rem;
      border: 3px solid #c9984a;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2a2a2a;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 600;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #c9984a;
      background: white;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
      color: #2a2a2a;
      transition: border-color 0.3s;
    }

    .form-input:focus {
      outline: none;
      border-color: #d4772e;
    }

    .textarea {
      resize: vertical;
      min-height: 80px;
    }

    .error-message {
      padding: 1rem;
      background: #ffebee;
      color: #c62828;
      border-left: 4px solid #c62828;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
    }

    .success-message {
      padding: 1rem;
      background: #e8f5e9;
      color: #2e7d32;
      border-left: 4px solid #2e7d32;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      font-family: Arial, Helvetica, sans-serif;
    }

    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: #d4772e;
      color: white;
      border: none;
      font-size: 1rem;
      font-family: Arial, Helvetica, sans-serif;
      cursor: pointer;
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
    }

    .submit-btn:hover:not(:disabled) {
      background: #b86625;
      transform: translateY(-2px);
    }

    .submit-btn:disabled {
      background: #8a8a8a;
      cursor: not-allowed;
      opacity: 0.6;
    }

    @media (max-width: 1024px) {
      .reservation-container {
        padding: 2rem;
      }

      .reservation-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    @media (max-width: 768px) {
      .reservation-container {
        padding: 1.5rem 1rem;
      }

      .reservation-title {
        font-size: 2rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .calendar-section,
      .form-section {
        padding: 1.5rem;
      }
    }
  `]
})
export class Reservation implements OnInit {
  private http = HttpClient;
  private apiUrl = 'http://localhost:8000/api/reservations';

  formData = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    date: '',
    heure: '',
    nombrePersonnes: '',
    demandeSpeciale: ''
  };

  weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  timeSlots: string[] = [];
  
  currentMonth = signal(new Date().getMonth());
  currentYear = signal(new Date().getFullYear());
  calendarDays = signal<any[]>([]);
  
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.generateTimeSlots();
    this.generateCalendar();
  }

  generateTimeSlots(): void {
    const slots: string[] = [];
    // Horaires de 11h45 à 14h et de 18h à 22h
    for (let h = 11; h <= 13; h++) {
      for (let m of [0, 15, 30, 45]) {
        if (h === 11 && m < 45) continue;
        slots.push(`${h}:${m.toString().padStart(2, '0')}`);
      }
    }
    slots.push('14:00');

    for (let h = 18; h <= 21; h++) {
      for (let m of [0, 15, 30, 45]) {
        slots.push(`${h}:${m.toString().padStart(2, '0')}`);
      }
    }
    slots.push('22:00');

    this.timeSlots = slots;
  }

  generateCalendar(): void {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    startDate.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const days: any[] = [];
    const totalDays = 42; // 6 semaines

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      days.push({
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        fullDate: date,
        isCurrentMonth: date.getMonth() === month
      });
    }

    this.calendarDays.set(days);
  }

  currentMonthName(): string {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return months[this.currentMonth()];
  }

  previousMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.set(this.currentYear() - 1);
    } else {
      this.currentMonth.set(this.currentMonth() - 1);
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.set(this.currentYear() + 1);
    } else {
      this.currentMonth.set(this.currentMonth() + 1);
    }
    this.generateCalendar();
  }

  selectDate(day: any): void {
    if (this.isPastDate(day) || !day.isCurrentMonth) return;
    
    const date = new Date(day.year, day.month, day.date);
    this.formData.date = date.toISOString().split('T')[0];
  }

  isSelected(day: any): boolean {
    if (!this.formData.date) return false;
    const selectedDate = new Date(this.formData.date);
    return selectedDate.getDate() === day.date &&
           selectedDate.getMonth() === day.month &&
           selectedDate.getFullYear() === day.year;
  }

  isToday(day: any): boolean {
    const today = new Date();
    return today.getDate() === day.date &&
           today.getMonth() === day.month &&
           today.getFullYear() === day.year;
  }

  isPastDate(day: any): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayDate = new Date(day.year, day.month, day.date);
    return dayDate < today;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('fr-FR', options);
  }

  submitReservation(): void {
    this.submitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const reservationData: ReservationRequest = {
      nom: this.formData.nom,
      prenom: this.formData.prenom,
      email: this.formData.email,
      telephone: this.formData.telephone,
      date: this.formData.date,
      heure: this.formData.heure,
      nombrePersonnes: parseInt(this.formData.nombrePersonnes),
      demandeSpeciale: this.formData.demandeSpeciale || undefined
    };

    this.httpClient.post<ReservationResponse>(this.apiUrl, reservationData).subscribe({
      next: (response) => {
        console.log('Réservation créée:', response);
        this.successMessage.set('Réservation confirmée ! Vous recevrez un email de confirmation.');
        this.resetForm();
        this.submitting.set(false);
      },
      error: (err: Error) => {
        console.error('Erreur réservation:', err);
        this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
        this.submitting.set(false);
      }
    });
  }

  resetForm(): void {
    this.formData = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      date: '',
      heure: '',
      nombrePersonnes: '',
      demandeSpeciale: ''
    };
  }
}