<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250924165310 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE plat_du_jour (id INT AUTO_INCREMENT NOT NULL, plat_id INT NOT NULL, jour VARCHAR(40) NOT NULL, INDEX IDX_7F3BF5DED73DB560 (plat_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE plat_du_jour ADD CONSTRAINT FK_7F3BF5DED73DB560 FOREIGN KEY (plat_id) REFERENCES plat (id)');
        $this->addSql('ALTER TABLE user DROP created_at, CHANGE name name VARCHAR(255) NOT NULL, CHANGE password password VARCHAR(255) NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON user (email)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE plat_du_jour DROP FOREIGN KEY FK_7F3BF5DED73DB560');
        $this->addSql('DROP TABLE plat_du_jour');
        $this->addSql('DROP INDEX UNIQ_8D93D649E7927C74 ON user');
        $this->addSql('ALTER TABLE user ADD created_at DATETIME DEFAULT NULL, CHANGE name name VARCHAR(180) NOT NULL, CHANGE password password VARCHAR(180) NOT NULL');
    }
}
