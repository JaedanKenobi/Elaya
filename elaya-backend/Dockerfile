# ÉTAPE 1: Installer les dépendances avec Composer
# Utiliser l'image OFFICIELLE COMPOSER pour installer les dépendances (très rapide)
FROM composer:2 AS vendor

# Définir le répertoire de travail dans le conteneur
WORKDIR /var/www/html

# Copier les fichiers Composer nécessaires
COPY composer.json composer.lock ./

# Installer les dépendances (sans les outils de développement)
RUN composer install --no-dev --optimize-autoloader --prefer-dist --ignore-platform-reqs --no-scripts
# ÉTAPE 2: Construire l'image finale (Runtime)
# Utiliser une image PHP-FPM (FastCGI Process Manager)
FROM php:8.3-fpm 

# Installer les extensions PHP nécessaires pour Symfony
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libxml2-dev \
    git \
    && docker-php-ext-install pdo_mysql opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Définir le répertoire de travail pour l'application Symfony
WORKDIR /var/www/html

# Copier le dossier 'vendor' depuis la première étape de build
COPY --from=vendor /var/www/html/vendor /var/www/html/vendor

# Copier le reste du code de l'application (source, config, etc.)
COPY . /var/www/html

# Créer les dossiers de cache et logs s'ils n'existent pas
RUN mkdir -p /var/www/html/var/cache /var/www/html/var/log

# Mettre à jour les permissions pour Symfony (cache, logs)
RUN chown -R www-data:www-data /var/www/html/var

# Commande par défaut pour lancer PHP-FPM (le moteur PHP)
CMD ["php-fpm"]