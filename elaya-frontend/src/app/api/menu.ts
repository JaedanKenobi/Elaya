import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Dish, DishRequest, DishResponse } from '../types/dish';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:8000/api/plats';

  constructor(private http: HttpClient) {}

  getAllDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  getDishById(id: number): Observable<Dish> {
    return this.http.get<Dish>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  addDish(data: DishRequest): Observable<DishResponse> {
    return this.http.post<DishResponse>(`${this.apiUrl}`, data)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur API Menu :', error);
    return throwError(() => new Error('Impossible de charger les plats.'));
  }
}
