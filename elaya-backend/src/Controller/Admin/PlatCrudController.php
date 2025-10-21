<?php

namespace App\Controller\Admin;

use App\Entity\Plat;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;

class PlatCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Plat::class;
    }

    public function configureFields(string $pageName): iterable
    {
        yield BooleanField::new('disponible');
        return [
            IdField::new('id')->hideOnForm(), // Identifiant auto
            TextField::new('nom', 'Nom du plat'),
            TextareaField::new('description', 'Description')->hideOnIndex(),
            MoneyField::new('prix', 'Prix')->setCurrency('EUR'),
            TextField::new('categorie', 'Catégorie (Entrée, Plat, Dessert, etc.)'),
        ];
    }
}
