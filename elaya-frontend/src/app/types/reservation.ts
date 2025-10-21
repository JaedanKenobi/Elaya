// src/app/types/reservation.ts

export interface Reservation {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  date: string;
  heure: string;
  nombrePersonnes: number;
  demandeSpeciale?: string;
  statut?: 'en_attente' | 'confirmee' | 'annulee';
  createdAt?: string;
  updatedAt?: string;
}

export interface ReservationRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  date: string;
  heure: string;
  nombrePersonnes: number;
  demandeSpeciale?: string;
}

export interface ReservationResponse {
  success: boolean;
  message: string;
  reservation?: Reservation;
}