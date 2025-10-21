export interface Newsletter {
  id?: number;
  email: string;
  dateInscription?: string;
}

/**
 * Données envoyées par un utilisateur qui s’inscrit à la newsletter
 */
export interface NewsletterRequest {
  email: string;
}

/**
 * Réponse du backend
 */
export interface NewsletterResponse {
  success: boolean;
  message: string;
  newsletter?: Newsletter;
}
