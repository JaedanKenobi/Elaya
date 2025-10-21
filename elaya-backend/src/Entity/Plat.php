<?php

namespace App\Entity;

use App\Repository\PlatRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PlatRepository::class)]
class Plat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $nom = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    private ?float $prix = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $image = null;

    #[ORM\Column(length: 100)]
    private ?string $categorie = null;

    #[ORM\Column]
    private ?bool $disponible = null;

    /**
     * @var Collection<int, PlatDuJour>
     */
    #[ORM\OneToMany(targetEntity: PlatDuJour::class, mappedBy: 'plat', orphanRemoval: true)]
    private Collection $plat;

    public function __construct()
    {
        $this->plat = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getPrix(): ?float
    {
        return $this->prix;
    }

    public function setPrix(float $prix): static
    {
        $this->prix = $prix;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function getCategorie(): ?string
    {
        return $this->categorie;
    }

    public function setCategorie(string $categorie): static
    {
        $this->categorie = $categorie;

        return $this;
    }

    public function isDisponible(): ?bool
    {
        return $this->disponible;
    }

    public function setDisponible(bool $disponible): static
    {
        $this->disponible = $disponible;

        return $this;
    }

    /**
     * @return Collection<int, PlatDuJour>
     */
    public function getPlat(): Collection
    {
        return $this->plat;
    }

    public function addPlat(PlatDuJour $plat): static
    {
        if (!$this->plat->contains($plat)) {
            $this->plat->add($plat);
            $plat->setPlat($this);
        }

        return $this;
    }

    public function removePlat(PlatDuJour $plat): static
    {
        if ($this->plat->removeElement($plat)) {
            // set the owning side to null (unless already changed)
            if ($plat->getPlat() === $this) {
                $plat->setPlat(null);
            }
        }

        return $this;
    }
}
