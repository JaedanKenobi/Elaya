<?php

namespace App\Controller\Api;

use App\Entity\Evenement;
use App\Repository\EvenementRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/evenements', name: 'api_evenements_')]
class EvenementController extends AbstractController
{
    #[Route('/', name: 'list', methods: ['GET'])]
    public function list(EvenementRepository $repo): JsonResponse
    {
        $data = [];
        foreach ($repo->findAll() as $ev) {
            $data[] = [
                'id' => $ev->getId(),
                'titre' => $ev->getTitre(),
                'description' => $ev->getDescription(),
                'date' => $ev->getDate()->format('Y-m-d H:i'),
            ];
        }

        return $this->json($data);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Evenement $evenement): JsonResponse
    {
        $data = [
            'id' => $evenement->getId(),
            'titre' => $evenement->getTitre(),
            'description' => $evenement->getDescription(),
            'date' => $evenement->getDate()->format('Y-m-d H:i'),
        ];

        return $this->json($data);
    }

    #[Route('/', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $ev = new Evenement();
        $ev->setTitre($data['titre'] ?? '');
        $ev->setDescription($data['description'] ?? '');
        $ev->setDate(new \DateTimeImmutable($data['date'] ?? 'now'));

        $em->persist($ev);
        $em->flush();

        return $this->json(['status' => 'Événement créé', 'id' => $ev->getId()]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Evenement $evenement, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($evenement);
        $em->flush();

        return $this->json(['status' => 'Événement supprimé']);
    }
}
