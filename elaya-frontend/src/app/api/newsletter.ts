import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Newsletter, NewsletterRequest, NewsletterResponse } from '../types/newsletter';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private apiUrl = 'http://localhost:8000/api/newsletters';

  constructor(private http: HttpClient) {}

  subscribe(data: NewsletterRequest): Observable<NewsletterResponse> {
    return this.http.post<NewsletterResponse>(`${this.apiUrl}`, data)
      .pipe(catchError(this.handleError));
  }

  getAllSubscribers(): Observable<Newsletter[]> {
    return this.http.get<Newsletter[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur API Newsletter :', error);
    return throwError(() => new Error('Une erreur est survenue lors de la requête newsletter.'));
  }
}
