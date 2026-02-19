FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist/cursos-front/browser ./
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY nginx/04-normalize-backend-url.sh /docker-entrypoint.d/04-normalize-backend-url.sh
RUN chmod +x /docker-entrypoint.d/04-normalize-backend-url.sh

ENV PORT=80
ENV BACKEND_URL=http://backend:8080
EXPOSE 80
