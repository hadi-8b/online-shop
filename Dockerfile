# آخرین نسخه PHP 8.4 با FPM
FROM php:8.4-fpm

# نصب پیش‌نیازها و اکستنشن‌های PHP
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd \
    && rm -rf /var/lib/apt/lists/*


# تنظیم دایرکتوری پروژه
WORKDIR /var/www/html

# کپی کردن فایل‌های پروژه لاراول
COPY ./backend /var/www/html

# تنظیم دسترسی‌ها
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
