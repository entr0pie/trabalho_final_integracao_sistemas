# Usa imagem oficial do PHP com Apache
FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Instala extensões necessárias para PDO, Redis, etc
RUN docker-php-ext-install pdo_pgsql

# Instala Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Define o diretório de trabalho da aplicação
WORKDIR /var/www/html

# Copia os arquivos do projeto para o container
COPY . .

# Instala as dependências do Composer
RUN composer install --no-dev --optimize-autoloader

# Ativa mod_rewrite (necessário pro Slim funcionar com URLs limpas)
RUN a2enmod rewrite

# Configura o Apache para permitir reescrita de URLs
COPY ./docker/vhost.conf /etc/apache2/sites-available/000-default.conf

RUN a2dissite 000-default && a2ensite 000-default.conf

# Expõe a porta padrão do Apache
EXPOSE 80

CMD ["apache2-foreground"]
