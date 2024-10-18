FROM php:7.4-fpm

#PHP拡張をインストール
RUN docker-php-ext-install mysqli pdo pdo_mysql

