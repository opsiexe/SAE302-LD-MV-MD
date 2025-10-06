FROM node:20

WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances dans le conteneur (optionnel pour build)
RUN npm install

# Copier le reste du projet
COPY . .

EXPOSE 3000

# Lancer le serveur de développement
CMD ["npm", "run", "dev"]