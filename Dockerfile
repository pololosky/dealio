# Utilisez une image Node.js légère pour la build (version 20 pour compatibilité avec Next.js récent)
FROM node:20-alpine AS builder

# Définissez le répertoire de travail
WORKDIR /app

# Copiez les fichiers de dépendances pour optimiser le cache Docker
COPY package.json package-lock.json ./

RUN npm install

# Copiez le reste du code source
COPY . .

# Générez le Prisma client (important pour Prisma)
RUN npx prisma generate

# Build l'application Next.js en mode production
RUN npm run build

# Étape finale : image de production légère
FROM node:20-alpine AS runner

# Définissez le répertoire de travail
WORKDIR /app

# Copiez les dépendances node_modules et le build de l'étape précédente
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma 

# Installez seulement les dépendances de production
RUN npm install --only=production

# Exposez le port (Next.js par défaut sur 3000)
EXPOSE 3000

# Commande pour démarrer l'app en mode production
CMD ["npm", "start"]