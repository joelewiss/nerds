FROM nginx

WORKDIR /var/www/devob/

COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir static
COPY static/ static/

EXPOSE 80 443
