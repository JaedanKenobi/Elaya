<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Entity\Plat;
use App\Entity\PlatDuJour;
use App\Entity\Commande;
use App\Entity\CommandePlat;
use App\Entity\Reservation;
use App\Entity\Evenement;

use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use EasyCorp\Bundle\Router\CrudUrlGenerator;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;

class DashboardController extends AbstractDashboardController
{
    #[Route('/admin', name: 'admin')]
    public function index(): Response
    {
        // Redirige vers la gestion des Plats par défaut
        $routeBuilder = $this->get(CrudUrlGenerator::class)->build();
        return $this->redirect($routeBuilder->setController(PlatCrudController::class)->generateUrl());
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Restaurant - Administration');
    }

    public function configureMenuItems(): iterable
    {
        // Section accueil
        yield MenuItem::linkToDashboard('Dashboard', 'fa fa-home');

        // Section Utilisateurs
        yield MenuItem::section('Utilisateurs');
        yield MenuItem::linkToCrud('Clients', 'fa fa-user', User::class);

        // Section Plats
        yield MenuItem::section('Carte & Menus');
        yield MenuItem::linkToCrud('Plats', 'fa fa-utensils', Plat::class);
        yield MenuItem::linkToCrud('Plat du Jour', 'fa fa-calendar-day', PlatDuJour::class);

        // Section Commandes
        yield MenuItem::section('Commandes');
        yield MenuItem::linkToCrud('Commandes', 'fa fa-receipt', Commande::class);
        yield MenuItem::linkToCrud('Détails Commande (Plats)', 'fa fa-list', CommandePlat::class);

        // Section Réservations
        yield MenuItem::section('Réservations');
        yield MenuItem::linkToCrud('Réservations', 'fa fa-chair', Reservation::class);

        // Section Événements
        yield MenuItem::section('Événements');
        yield MenuItem::linkToCrud('Événements', 'fa fa-calendar', Evenement::class);
    }
}
