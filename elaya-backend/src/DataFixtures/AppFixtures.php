<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Plat;
use App\Entity\PlatDuJour;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // --------- ADMIN ---------
        $admin = new User();
        $admin->setName('Admin');
        $admin->setEmail('restaurant.elaya63@gmail.com');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword(
            $this->passwordHasher->hashPassword($admin, 'Pelaya632024')
        );
        $manager->persist($admin);

        // --------- PLATS / ENTREE / DESSERT / BOISSON ---------
        $platsData = [
            ['Salade de fonio', 'Fonio frais, oignons, concombres, tomate et persil, vinaigrette acidulée', 6.00, 'Entrée'],
            ['Salade ELAYA', 'Tomates, concombres, avocats, oignon rouge, morceaux de mangue', 8.00, 'Entrée'],
            ['Pastels', 'Beignets croustillants (crevettes, steak ou végétarien)', 6.00, 'Entrée'],
            ['Beignets salés', 'Beignets croustillants (steak ou crevette + riz)', 5.00, 'Entrée'],
            ['Foutou sauce graine', 'Pâte de bananes plantains avec sauce fruit de palme, poulet, haricots, fonio et gombos', 16.00, 'Plat'],
            ['Attiéké', 'Semoule de manioc avec poulet et sauce tomate aux épices', 10.00, 'Plat'],
            ['Sauce Yassa', 'Poulet mariné aux épices, grillé et mijoté dans sauce aux oignons', 12.00, 'Plat'],
            ['Curry malien', 'Poulet mijoté dans sauce onctueuse aux épices maliennes, servi avec riz blanc', 13.00, 'Plat'],
            ['Tigadégué (Mafé)', 'Ragoût riche à base de pâte d\'arachide, légumes et viandes', 16.00, 'Plat'],
            ['Zamin', 'Riz parfumé cuit dans sauce tomate avec poulet ou poisson', 14.00, 'Plat'],
            ['Poulet (Sandwich)', 'Poulet mariné grillé, légumes frais, sauce dans pain croustillant', 9.00, 'Sandwich'],
            ['Végétarien (Sandwich)', 'Boulettes végétariennes légèrement épicées dans pain moelleux', 8.00, 'Sandwich'],
            ['Beignet sucré', 'Crème au choix : lait, chocolat, caramel', 5.00, 'Dessert'],
            ['Degué', 'Yaourt africain', 4.00, 'Dessert'],
            ['Panini choco/nutella', 'Panini sucré', 4.50, 'Dessert'],
            ['Coco mango', 'Perles de tapioca, lait de coco, mousse de mangue', 4.00, 'Dessert'],
            ['Bouteille d\'eau 50cl', 'Eau', 1.50, 'Boisson'],
            ['Canette soda', 'Coca, Perrier, Oasis...', 2.00, 'Boisson'],
            ['Cocktail', 'Coco, ananas, gingembre etc.', 3.00, 'Boisson'],
            ['Jinjinbré (Gnamakoudji)', 'Boisson africaine', 3.00, 'Boisson'],
            ['Dableni', 'Boisson', 3.00, 'Boisson'],
            ['Café', 'Boisson chaude', 1.50, 'Boisson'],
            ['Thé', 'Boisson chaude', 2.00, 'Boisson'],
            ['Vin rouge (Pichet)', 'Alcool', 10.00, 'Alcool'],
            ['Verre de vin rouge', 'Alcool', 3.50, 'Alcool'],
            ['Vin blanc (Pichet)', 'Alcool', 9.00, 'Alcool'],
            ['Verre de vin blanc', 'Alcool', 3.50, 'Alcool'],
            ['Punch exotique', 'Alcool', 5.50, 'Alcool'],
            ['Banane plantain', 'Accompagnement', 5.00, 'Accompagnement'],
            ['Frites patate douce', 'Accompagnement', 3.00, 'Accompagnement'],
            ['Frites de pomme de terre', 'Accompagnement', 2.00, 'Accompagnement'],
            ['Sauce Pimenté (25ml)', 'Accompagnement', 1.00, 'Accompagnement'],
            ['Sauce Tomate (50ml)', 'Accompagnement', 0.50, 'Accompagnement'],
            ['Sauce Verte (50ml)', 'Accompagnement', 1.00, 'Accompagnement'],
        ];

        $plats = [];
        foreach ($platsData as [$nom, $desc, $prix, $categorie]) {
            $plat = new Plat();
            $plat->setNom($nom);
            $plat->setDescription($desc);
            $plat->setPrix($prix);
            $plat->setCategorie($categorie);
            $plat->setDisponible(true); // <- Ajouté pour éviter l'erreur
            $manager->persist($plat);
            $plats[$nom] = $plat;
        }

        // --------- PLATS DU JOUR ---------
        $platsDuJourData = [
            ['Foutou sauce graine', 'Mardi'],
            ['Attiéké', 'Mercredi'],
            ['Sauce Yassa', 'Jeudi'],
            ['Curry malien', 'Vendredi'],
            ['Tigadégué (Mafé)', 'Samedi'],
            ['Zamin', 'Dimanche'],
        ];

        foreach ($platsDuJourData as [$nomPlat, $jour]) {
            $platDuJour = new PlatDuJour();
            $platDuJour->setPlat($plats[$nomPlat]);
            $platDuJour->setJour($jour);
            $manager->persist($platDuJour);
        }

        // --------- FIN ---------
        $manager->flush();
    }
}
