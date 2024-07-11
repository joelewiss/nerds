FROM php:7-fpm

WORKDIR /var/www/


# We have to do this to install PHP extensions
# Install docker-php-extension-installer
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN chmod +x /usr/local/bin/install-php-extensions && sync && \
    install-php-extensions gd xdebug


RUN install-php-extensions pgsql pdo_pgsql redis @composer zip

RUN composer require google/recaptcha "~1.1" &&\
    composer require aws/aws-sdk-php &&\
    composer install


RUN mkdir /var/www/devob/
COPY app/ /var/www/devob/
RUN mkdir /var/www/webpageConf
COPY webpageConf/ /var/www/webpageConf/
