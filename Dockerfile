FROM node:22.17.0-alpine

WORKDIR /src

# les fichier de dependances
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Générer le client Prisma
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

# POUR DEMARER L'APPLICATION
CMD [ "npm","start" ]