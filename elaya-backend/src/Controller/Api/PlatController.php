<?php

namespace App\Controller\Api;

use App\Entity\Plat;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/plats', name: 'api_plats_')]
class PlatController extends AbstractController
{
    #[Route('/', name: 'list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $plats = $em->getRepository(Plat::class)->findAll();

        $data = [];
        foreach ($plats as $plat) {
            $data[] = [
                'id' => $plat->getId(),
                'nom' => $plat->getNom(),
                'description' => $plat->getDescription(),
                'prix' => $plat->getPrix(),
                'categorie' => $plat->getCategorie(),
                // ⚡ correction : on appelle isDisponible()
                'disponible' => $plat->isDisponible(),
            ];
        }

        return $this->json($data);
    }
}
