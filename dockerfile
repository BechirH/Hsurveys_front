# Étape 1 : Build de l'app React
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Étape 2 : Servir via nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80