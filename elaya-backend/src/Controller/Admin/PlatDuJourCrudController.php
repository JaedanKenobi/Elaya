<?php

namespace App\Controller\Admin;

use App\Entity\PlatDuJour;
use App\Entity\Plat;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;

class PlatDuJourCrudController extends AbstractCrudController
{
    /**
     * 👇 Indique à EasyAdmin quelle entité ce CRUD doit gérer
     */
    public static function getEntityFqcn(): string
    {
        return PlatDuJour::class;
    }

    /**
     * 👇 Configure les champs affichés dans les formulaires et listes
     */
    public function configureFields(string $pageName): iterable
    {
        return [
            // 🔑 Identifiant unique (souvent affiché seulement en lecture)
            IdField::new('id')->hideOnForm(),

            // 📅 Date du plat du jour
            DateField::new('jour', 'Jour du service'),

            // 🔗 Relation avec l’entité Plat (choisir le plat du jour)
            AssociationField::new('plat', 'Plat proposé')
                ->setFormTypeOption('choice_label', 'nom') // affiche le nom du plat dans la liste déroulante
        ];
    }
}
