// src/app/api/auth.ts

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'client';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  password_confirmation: string;
  telephone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';

  // Signals pour l'état de connexion
  currentUser = signal<User | null>(null);
  token = signal<string | null>(null);

  // Computed signals
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  isClient = computed(() => this.currentUser()?.role === 'client');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadFromStorage();
  }

  // Charger les données depuis localStorage au démarrage
  private loadFromStorage(): void {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
        this.token.set(storedToken);
      } catch (e) {
        console.error('Erreur lors du chargement des données:', e);
        this.clearStorage();
      }
    }
  }

  // Sauvegarder dans localStorage
  private saveToStorage(user: User, token: string): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }

  // Nettoyer localStorage
  private clearStorage(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  // Connexion
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.user && response.token) {
          this.currentUser.set(response.user);
          this.token.set(response.token);
          this.saveToStorage(response.user, response.token);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Inscription
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        if (response.success && response.user && response.token) {
          this.currentUser.set(response.user);
          this.token.set(response.token);
          this.saveToStorage(response.user, response.token);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Déconnexion
  logout(): void {
    // Appel API optionnel pour invalider le token côté serveur
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => console.log('Déconnexion serveur OK'),
      error: (err) => console.error('Erreur déconnexion serveur:', err)
    });

    this.currentUser.set(null);
    this.token.set(null);
    this.clearStorage();
    this.router.navigate(['/']);
  }

  // Récupérer le profil utilisateur
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap(user => this.currentUser.set(user)),
      catchError(this.handleError)
    );
  }

  // Mettre à jour le profil
  updateProfile(data: Partial<User>): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}/profile`, data).pipe(
      tap(response => {
        if (response.success && response.user) {
          this.currentUser.set(response.user);
          const token = this.token();
          if (token) {
            this.saveToStorage(response.user, token);
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse) {
    console.error('Erreur API Auth:', error);
    let errorMessage = 'Une erreur est survenue';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = 'Email ou mot de passe incorrect';
    } else if (error.status === 422) {
      errorMessage = 'Données invalides';
    }

    return throwError(() => new Error(errorMessage));
  }
}