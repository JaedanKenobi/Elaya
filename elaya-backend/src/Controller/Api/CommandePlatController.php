<?php

namespace App\Controller\Api;

use App\Entity\CommandePlat;
use App\Repository\CommandePlatRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/commande-plats', name: 'api_commande_plats_')]
class CommandePlatController extends AbstractController
{
    #[Route('/', name: 'list', methods: ['GET'])]
    public function list(CommandePlatRepository $repo): JsonResponse
    {
        $data = [];
        foreach ($repo->findAll() as $cp) {
            $data[] = [
                'id' => $cp->getId(),
                'commande_id' => $cp->getCommande()->getId(),
                'plat' => $cp->getPlat()->getName(),
                'quantite' => $cp->getQuantite(),
            ];
        }

        return $this->json($data);
    }
}
