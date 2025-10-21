<?php
namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/auth', name: 'api_auth_')]
class AuthController extends AbstractController
{
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(
        Request $request, 
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        
        // 1. Décodage et vérification du corps JSON
        $data = json_decode($request->getContent(), true);
        
        // Si le corps JSON est vide ou invalide (retourne null), renvoyer une erreur 400
        if ($data === null) {
            return new JsonResponse([
                'error' => true, 
                'message' => 'Invalid JSON body.'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
        
        // 2. Vérification des champs requis (pour éviter l'erreur si 'email' est manquant)
        $requiredFields = ['email', 'password', 'password_confirmation', 'nom', 'prenom'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                return new JsonResponse([
                    'error' => true,
                    'message' => 'Missing required field: ' . $field
                ], JsonResponse::HTTP_BAD_REQUEST);
            }
        }
        
        // Vérification de la confirmation du mot de passe
        if ($data['password'] !== $data['password_confirmation']) {
            return new JsonResponse([
                'error' => true,
                'message' => 'Password confirmation does not match.'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
        
        // --- LOGIQUE D'INSCRIPTION ---
        
        // Créer le user
        $user = new User();
        
        // Lignes qui causaient potentiellement l'erreur (maintenant sécurisées par les vérifications ci-dessus)
        $user->setEmail($data['email']);
        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);
        $user->setRoles(['ROLE_CLIENT']);
        
        // Hasher le password
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);
        
        $em->persist($user);
        
        // IMPORTANT : Si l'utilisateur existe déjà (contrainte UNIQUE sur l'email), 
        // cela peut toujours provoquer une erreur 500 si la base de données lance une exception non gérée.
        // C'est mieux de vérifier l'existence de l'utilisateur avant d'appeler flush().
        
        try {
            $em->flush();
        } catch (\Exception $e) {
            // Gérer une potentielle erreur de base de données (ex: email déjà existant)
            return new JsonResponse([
                'error' => true,
                'message' => 'Registration failed due to a database error (e.g., email already registered).'
            ], JsonResponse::HTTP_CONFLICT); // Code 409 Conflict
        }
        
        return $this->json([
            'success' => true,
            'message' => 'Inscription réussie'
        ], JsonResponse::HTTP_CREATED); // Code 201 Created pour une nouvelle ressource
    }
    
    // ... (méthode profile reste inchangée)
}