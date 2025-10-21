<?php

namespace App\Entity;

use App\Repository\PlatDuJourRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PlatDuJourRepository::class)]
class PlatDuJour
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'plat')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Plat $plat = null;

    #[ORM\Column(length: 40)]
    private ?string $Jour = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPlat(): ?Plat
    {
        return $this->plat;
    }

    public function setPlat(?Plat $plat): static
    {
        $this->plat = $plat;

        return $this;
    }

    public function getJour(): ?string
    {
        return $this->Jour;
    }

    public function setJour(string $Jour): static
    {
        $this->Jour = $Jour;

        return $this;
    }
}
