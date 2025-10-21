export interface Dish {
  id?: number;
  nom: string;
  description?: string;
  prix: number;
  image?: string;
  categorie?: string;
  disponible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Données envoyées depuis le front pour créer/modifier un plat
 */
export interface DishRequest {
  nom: string;
  description?: string;
  prix: number;
  image?: string;
  categorie?: string;
  disponible: boolean;
}

/**
 * Réponse du backend
 */
export interface DishResponse {
  success: boolean;
  message: string;
  plat?: Dish;
}
