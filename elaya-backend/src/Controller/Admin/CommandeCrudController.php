<?php

namespace App\Controller\Admin;

use App\Entity\Commande;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;

class CommandeCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Commande::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            AssociationField::new('user', 'Client')->setFormTypeOption('choice_label', 'email'),
            DateTimeField::new('date', 'Date de la commande'),
            MoneyField::new('total', 'Total')->setCurrency('EUR'),
            ChoiceField::new('status', 'Statut')->setChoices([
                'En attente' => 'pending',
                'Payée' => 'paid',
                'Annulée' => 'cancelled',
            ]),
        ];
    }
}
