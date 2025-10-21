<?php

namespace App\Controller\Api;

use App\Entity\PlatDuJour;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/platdujour', name: 'api_platdujour_')]
class PlatDuJourController extends AbstractController
{
    #[Route('/', name: 'list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $platsDuJour = $em->getRepository(PlatDuJour::class)->findAll();

        $data = [];
        foreach ($platsDuJour as $platDuJour) {
            $data[] = [
                'id' => $platDuJour->getId(),
                'plat' => $platDuJour->getPlat()->getNom(),
                'jour' => $platDuJour->getJour(),
            ];
        }

        return $this->json($data);
    }
}
