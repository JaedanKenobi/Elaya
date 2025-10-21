<?php

namespace App\Controller\Admin;

use App\Entity\CommandePlat;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;

class CommandePlatCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return CommandePlat::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            AssociationField::new('commande', 'Commande')->setFormTypeOption('choice_label', 'id'),
            AssociationField::new('plat', 'Plat')->setFormTypeOption('choice_label', 'nom'),
            IntegerField::new('quantite', 'Quantité'),
        ];
    }
}
