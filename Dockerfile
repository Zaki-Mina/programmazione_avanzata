# Usa l'immagine Node.js LTS come base
FROM node:lts-stretch-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]

