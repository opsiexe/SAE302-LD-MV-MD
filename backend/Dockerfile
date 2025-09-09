FROM node:20

WORKDIR /app

COPY package*.json ./

# Ne pas installer automatiquement pour dev, on fera dans le conteneur
RUN npm install

COPY . .

EXPOSE 5000

# Conteneur reste allumé pour initialisation
CMD ["npx", "nodemon", "server.js"]
