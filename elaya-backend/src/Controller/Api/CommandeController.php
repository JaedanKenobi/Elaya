<?php

namespace App\Controller\Api;

use App\Entity\Commande;
use App\Entity\CommandePlat;
use App\Entity\User;
use App\Repository\CommandeRepository;
use App\Repository\PlatRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/commandes', name: 'api_commandes_')]
class CommandeController extends AbstractController
{
    #[Route('/', name: 'list', methods: ['GET'])]
    public function list(CommandeRepository $repo): JsonResponse
    {
        $commandes = $repo->findAll();
        $data = [];

        foreach ($commandes as $commande) {
            $plats = [];
            foreach ($commande->getCommandePlats() as $cp) {
                $plats[] = [
                    'plat' => $cp->getPlat()->getName(),
                    'quantite' => $cp->getQuantite(),
                ];
            }

            $data[] = [
                'id' => $commande->getId(),
                'date' => $commande->getDate()->format('Y-m-d H:i'),
                'total' => $commande->getTotal(),
                'plats' => $plats,
            ];
        }

        return $this->json($data);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Commande $commande): JsonResponse
    {
        $plats = [];
        foreach ($commande->getCommandePlats() as $cp) {
            $plats[] = [
                'plat' => $cp->getPlat()->getName(),
                'quantite' => $cp->getQuantite(),
            ];
        }

        $data = [
            'id' => $commande->getId(),
            'date' => $commande->getDate()->format('Y-m-d H:i'),
            'total' => $commande->getTotal(),
            'plats' => $plats,
        ];

        return $this->json($data);
    }

    // DÉJÀ MODIFIÉ selon l'autre IA
    #[Route('/', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        PlatRepository $platRepo,
        #[CurrentUser] ?User $user = null
    ): JsonResponse {
        $data = json_decode($request->getContent(), true) ?: [];

        $commande = new Commande();
        $commande->setDate(new \DateTimeImmutable());

        // Champs venant du front Angular
        $commande->setNom($data['nom'] ?? '');
        $commande->setPrenom($data['prenom'] ?? '');
        $commande->setEmail($data['email'] ?? '');
        $commande->setTelephone($data['telephone'] ?? '');
        $commande->setHeureRetrait($data['heureRetrait'] ?? null);
        $commande->setTotal($data['totalAmount'] ?? 0);

        if ($user) {
            $commande->setUser($user);
        }

        if (!empty($data['items']) && is_array($data['items'])) {
            foreach ($data['items'] as $item) {
                $platId = $item['platId'] ?? null;
                if (!$platId) {
                    continue;
                }
                $quantite = $item['quantite'] ?? 1;

                $plat = $platRepo->find($platId);
                if ($plat) {
                    $cp = new CommandePlat();
                    $cp->setPlat($plat);
                    $cp->setQuantite($quantite);
                    $cp->setCommande($commande);
                    $em->persist($cp);
                }
            }
        }

        $em->persist($commande);
        $em->flush();

        return $this->json([
            'success' => true,
            'message' => 'Commande créée',
            'commande' => [
                'id' => $commande->getId(),
            ],
        ]);
    }

    // MODIFIÉ: auth + 401 + mapping propre
    #[Route('/mes-commandes', name: 'mes_commandes', methods: ['GET'])]
    public function mesCommandes(
        EntityManagerInterface $em,
        #[CurrentUser] ?User $user = null
    ): JsonResponse {
        if (!$user) {
            return $this->json([
                'success' => false,
                'message' => 'Non authentifié',
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Tri sur 'date' (si ton entité utilise 'createdAt', change ci-dessous)
        $commandes = $em->getRepository(Commande::class)
            ->findBy(['user' => $user], ['date' => 'DESC']);

        $data = [];
        foreach ($commandes as $commande) {
            $items = [];
            foreach ($commande->getCommandePlats() as $cp) {
                $items[] = [
                    'plat' => $cp->getPlat()->getName(),
                    'quantite' => $cp->getQuantite(),
                ];
            }

            $data[] = [
                'id' => $commande->getId(),
                'date' => $commande->getDate()->format('Y-m-d H:i'),
                'total' => $commande->getTotal(),
                'heureRetrait' => method_exists($commande, 'getHeureRetrait') ? $commande->getHeureRetrait() : null,
                'statut' => method_exists($commande, 'getStatut') ? $commande->getStatut() : null,
                'items' => $items,
            ];
        }

        return $this->json($data);
    }
}