<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250924151106 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE commande (id INT AUTO_INCREMENT NOT NULL, nom_client VARCHAR(255) NOT NULL, email VARCHAR(180) NOT NULL, telephone VARCHAR(15) DEFAULT NULL, type_commande VARCHAR(180) NOT NULL, statut VARCHAR(180) NOT NULL, created_at DATETIME DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE commande_plat (id INT AUTO_INCREMENT NOT NULL, commande_id INT DEFAULT NULL, plat_id INT DEFAULT NULL, INDEX IDX_4B54A3E482EA2E54 (commande_id), INDEX IDX_4B54A3E4D73DB560 (plat_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE evenement (id INT AUTO_INCREMENT NOT NULL, titre VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, date DATETIME NOT NULL, image VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE plat (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(180) NOT NULL, description LONGTEXT DEFAULT NULL, prix DOUBLE PRECISION NOT NULL, image VARCHAR(255) DEFAULT NULL, categorie VARCHAR(100) NOT NULL, disponible TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reservation (id INT AUTO_INCREMENT NOT NULL, nom_client VARCHAR(255) NOT NULL, email VARCHAR(180) NOT NULL, telephone VARCHAR(15) DEFAULT NULL, date_heure DATETIME NOT NULL, nombre_personnes INT NOT NULL, statut VARCHAR(180) NOT NULL, created_at DATETIME DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(180) NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(180) NOT NULL, created_at DATETIME DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE commande_plat ADD CONSTRAINT FK_4B54A3E482EA2E54 FOREIGN KEY (commande_id) REFERENCES commande (id)');
        $this->addSql('ALTER TABLE commande_plat ADD CONSTRAINT FK_4B54A3E4D73DB560 FOREIGN KEY (plat_id) REFERENCES plat (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE commande_plat DROP FOREIGN KEY FK_4B54A3E482EA2E54');
        $this->addSql('ALTER TABLE commande_plat DROP FOREIGN KEY FK_4B54A3E4D73DB560');
        $this->addSql('DROP TABLE commande');
        $this->addSql('DROP TABLE commande_plat');
        $this->addSql('DROP TABLE evenement');
        $this->addSql('DROP TABLE plat');
        $this->addSql('DROP TABLE reservation');
        $this->addSql('DROP TABLE user');
    }
}
