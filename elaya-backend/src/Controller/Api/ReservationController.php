<?php

namespace App\Controller\Api;

use App\Entity\Reservation;
use App\Entity\User;
use App\Repository\ReservationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/reservations', name: 'api_reservations_')]
class ReservationController extends AbstractController
{
    #[Route('/', name: 'list', methods: ['GET'])]
    public function list(ReservationRepository $repo): JsonResponse
    {
        $data = [];
        foreach ($repo->findAll() as $res) {
            $data[] = [
                'id' => $res->getId(),
                'nom' => $res->getNom(),
                'email' => $res->getEmail(),
                'telephone' => $res->getTelephone(),
                'date' => $res->getDate()->format('Y-m-d H:i'),
                'personnes' => $res->getPersonnes(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Reservation $reservation): JsonResponse
    {
        $data = [
            'id' => $reservation->getId(),
            'nom' => $reservation->getNom(),
            'email' => $reservation->getEmail(),
            'telephone' => $reservation->getTelephone(),
            'date' => $reservation->getDate()->format('Y-m-d H:i'),
            'personnes' => $reservation->getPersonnes(),
        ];

        return $this->json($data);
    }

    // MODIFIÉ selon les instructions de l'autre IA
    #[Route('/', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        #[CurrentUser] ?User $user = null
    ): JsonResponse {
        // Décodage JSON sûr
        $data = json_decode($request->getContent(), true) ?: [];

        $res = new Reservation();
        $res->setNom($data['nom'] ?? '');
        $res->setPrenom($data['prenom'] ?? '');
        $res->setEmail($data['email'] ?? '');
        $res->setTelephone($data['telephone'] ?? '');
        $res->setPersonnes($data['nombrePersonnes'] ?? 1);
        // Attention: si date invalide → exception. On peut sécuriser si besoin.
        $res->setDate(new \DateTimeImmutable($data['date'] ?? 'now'));
        $res->setHeure($data['heure'] ?? '');
        $res->setDemandeSpeciale($data['demandeSpeciale'] ?? null);
        $res->setStatut('en_attente'); // Statut par défaut

        // Lier à l'utilisateur si connecté
        if ($user) {
            $res->setUser($user);
        }

        $em->persist($res);
        $em->flush();

        return $this->json([
            'success' => true,
            'message' => 'Réservation créée',
            'reservation' => [
                'id' => $res->getId(),
            ],
        ]);
    }

    // DÉJÀ MODIFIÉ précédemment: auth + 401 + mapping
    #[Route('/mes-reservations', name: 'mes_reservations', methods: ['GET'])]
    public function mesReservations(
        EntityManagerInterface $em,
        #[CurrentUser] ?User $user
    ): JsonResponse {
        if (!$user) {
            return $this->json([
                'success' => false,
                'message' => 'Non authentifié',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $reservations = $em->getRepository(Reservation::class)
            ->findBy(['user' => $user], ['date' => 'DESC']);

        $data = [];
        foreach ($reservations as $res) {
            $date = $res->getDate();
            $data[] = [
                'id' => $res->getId(),
                'nom' => $res->getNom(),
                'prenom' => method_exists($res, 'getPrenom') ? $res->getPrenom() : null,
                'email' => $res->getEmail(),
                'telephone' => $res->getTelephone(),
                'date' => $date instanceof \DateTimeInterface ? $date->format('Y-m-d') : null,
                'heure' => method_exists($res, 'getHeure')
                    ? $res->getHeure()
                    : ($date instanceof \DateTimeInterface ? $date->format('H:i') : null),
                'nombrePersonnes' => $res->getPersonnes(),
                'demandeSpeciale' => method_exists($res, 'getDemandeSpeciale') ? $res->getDemandeSpeciale() : null,
                'statut' => method_exists($res, 'getStatut') ? $res->getStatut() : null,
                'createdAt' => $date instanceof \DateTimeInterface ? $date->format('Y-m-d H:i:s') : null,
            ];
        }

        return $this->json($data);
    }
}