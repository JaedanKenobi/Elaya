export interface Event {
  id?: number;
  titre: string;
  description?: string;
  date: string;
  heure?: string;
  image?: string;
  lieu?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Données envoyées depuis le front pour créer/modifier un événement
 */
export interface EventRequest {
  titre: string;
  description?: string;
  date: string;
  heure?: string;
  image?: string;
  lieu?: string;
}

/**
 * Réponse du backend
 */
export interface EventResponse {
  success: boolean;
  message: string;
  event?: Event;
}
