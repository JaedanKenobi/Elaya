import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Event, EventRequest, EventResponse } from '../types/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8000/api/evenements';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  addEvent(data: EventRequest): Observable<EventResponse> {
    return this.http.post<EventResponse>(`${this.apiUrl}`, data)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur API Événements :', error);
    return throwError(() => new Error('Impossible de charger les événements.'));
  }
}
