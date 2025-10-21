export interface Order {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  plats: OrderItem[];
  total: number;
  statut?: 'en_attente' | 'en_preparation' | 'pret' | 'livre';
  heureRetrait?: string; // pour les commandes à emporter
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Détail d’un plat dans une commande
 */
export interface OrderItem {
  platId: number;
  quantite: number;
}

/**
 * Données envoyées lors de la commande
 */
export interface OrderRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  plats: OrderItem[];
  heureRetrait?: string;
}

/**
 * Réponse du backend
 */
export interface OrderResponse {
  success: boolean;
  message: string;
  commande?: Order;
}
