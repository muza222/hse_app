FROM nginx:1.23

COPY ./public_html/epp-frontend-new/ /usr/share/nginx/html/
EXPOSE 80
