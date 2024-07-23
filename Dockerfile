FROM node:lts AS build-stage

WORKDIR /app

RUN npm i -g @angular/cli

COPY package*.json ./
RUN npm ci

COPY . .
RUN ng build


FROM nginx AS production-stage

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist/sytivities/browser/ .

EXPOSE 80

