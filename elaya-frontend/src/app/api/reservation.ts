import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reservation, ReservationRequest, ReservationResponse } from '../types/reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8000/api/reservations';

  constructor(private http: HttpClient) {}

  createReservation(data: ReservationRequest): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(`${this.apiUrl}`, data)
      .pipe(catchError(this.handleError));
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur API Réservation :', error);
    return throwError(() => new Error('Une erreur est survenue lors de la requête.'));
  }
}
