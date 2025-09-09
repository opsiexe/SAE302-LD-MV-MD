FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@11.6.0
# npm install à faire dans le conteneur
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
