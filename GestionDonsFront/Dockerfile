# Étape 1 : Build
FROM node:20 AS build

WORKDIR /app

# Copier package.json et package-lock.json / package*.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le projet
COPY . .

# Build avec Vite
RUN npm run build

# Étape 2 : Serveur nginx
FROM nginx:alpine

# Copier le build de Vite dans nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port
EXPOSE 80

# Lancer nginx
CMD ["nginx", "-g", "daemon off;"]
