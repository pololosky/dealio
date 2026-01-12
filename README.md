# 🏪 Dealio - Plateforme SaaS Multi-tenant de Gestion Commerciale

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5+-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?style=for-the-badge&logo=postgresql)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-v4+-000000?style=for-the-badge&logo=next.js&logoColor=white)

Plateforme SaaS complète de gestion de commerce avec système multi-tenant, authentification avancée, gestion des stocks, point de vente (POS), et suivi des ventes en temps réel.

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Technologies utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Schéma de base de données](#-schéma-de-base-de-données)
- [Structure du projet](#-structure-du-projet)
- [Authentification et sécurité](#-authentification-et-sécurité)
- [Gestion des rôles (RBAC)](#-gestion-des-rôles-rbac)
- [API Routes](#-api-routes)
- [Utilisation](#-utilisation)
- [Scripts disponibles](#-scripts-disponibles)
- [Déploiement](#-déploiement)
- [Contributeurs](#-contributeurs)

---

## ✨ Fonctionnalités

### 🔐 Authentification et sécurité

- ✅ Système d'inscription avec création automatique de commerce (Tenant)
- ✅ Vérification d'email obligatoire avec lien unique
- ✅ Connexion sécurisée avec NextAuth v5
- ✅ Sessions JWT avec refresh automatique
- ✅ Hash des mots de passe avec bcrypt (12 rounds)
- ✅ Protection CSRF et validation des tokens
- ✅ Isolation multi-tenant stricte

### 👥 Gestion d'équipe

- ✅ Hiérarchie des rôles : SUPERADMIN > DIRECTEUR > GÉRANT > VENDEUR > MAGASINIER
- ✅ CRUD complet des utilisateurs avec permissions
- ✅ Création, modification, suppression d'employés
- ✅ Filtrage et recherche d'utilisateurs
- ✅ Vérification hiérarchique des permissions

### 📦 Gestion des produits et stocks

- ✅ CRUD complet des produits
- ✅ Gestion des stocks en temps réel
- ✅ Alertes de stock bas (< 10 unités)
- ✅ Indicateurs visuels de rupture de stock
- ✅ Recherche et filtrage de produits
- ✅ Permissions granulaires (seul MAGASINIER peut modifier le stock)

### 💰 Système de vente (POS - Point of Sale)

- ✅ Interface de caisse intuitive et responsive
- ✅ Recherche de produits en temps réel
- ✅ Panier avec ajustement de quantités (+/-)
- ✅ Calcul automatique du total
- ✅ Vérification du stock avant validation
- ✅ **Transaction atomique Prisma** (vente + déduction stock)
- ✅ Messages de succès/erreur clairs
- ✅ Rechargement automatique après vente

### 📊 Historique et statistiques

- ✅ Registre complet des ventes (lecture seule)
- ✅ Filtrage par date, vendeur, montant
- ✅ Export CSV pour comptabilité
- ✅ Détails complets de chaque vente
- ✅ Dashboard avec KPIs en temps réel :
  - Ventes du jour
  - Chiffre d'affaires
  - Nombre de transactions
  - Articles en stock
  - Panier moyen
  - Équipe active

### 🎨 Interface utilisateur

- ✅ Design moderne avec Tailwind CSS + DaisyUI
- ✅ Menu dynamique selon le rôle
- ✅ Thème personnalisable (lofi par défaut)
- ✅ Responsive (mobile, tablette, desktop)
- ✅ Animations et transitions fluides
- ✅ Badges et indicateurs visuels

---

## 🏗️ Architecture

### Multi-tenant

Chaque **Directeur** possède son propre **Tenant** (commerce) avec :

- Isolation complète des données
- Base de données partagée avec filtrage par `tenantId`
- Nom unique et domaine personnalisé optionnel

### Sécurité des routes API

Toutes les API routes vérifient :

1. Authentification (session valide)
2. Appartenance au tenant
3. Permissions du rôle
4. Isolation des données

### Transaction atomique

Les ventes utilisent `prisma.$transaction` pour garantir :

- Création de la vente
- Création des items de vente
- Déduction du stock
- **Tout réussit ou tout échoue** (pas de vente partielle)

---

## 🛠️ Technologies utilisées

### Frontend

- **Next.js 15+** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles utilitaires
- **DaisyUI** - Composants UI
- **Lucide React** - Icônes modernes

### Backend

- **NextAuth v5** - Authentification
- **Prisma** - ORM pour PostgreSQL
- **bcryptjs** - Hash des mots de passe
- **Nodemailer** - Envoi d'emails

### Base de données

- **PostgreSQL 16+** - Base de données relationnelle
- **Prisma Migrate** - Gestion des migrations

### Outils

- **ESLint** - Linting
- **Prettier** - Formatage du code

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/pololosky/dealio.git
cd dealio
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer la base de données PostgreSQL

**Option A : PostgreSQL local**

```bash
# Créer une base de données
createdb dealio
```

**Option B : PostgreSQL en ligne (Supabase, Neon, etc.)**

- Créez un projet sur Supabase ou Neon
- Copiez l'URL de connexion

### 4. Configurer les variables d'environnement

Créez un fichier `.env` à la racine :

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dealio"

# NextAuth
AUTH_SECRET="votre-secret-genere-avec-openssl-rand-base64-32"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email (SMTP) - Configuration Gmail
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre-email@gmail.com"
SMTP_PASSWORD="votre-app-password-google"

# OU Email (SMTP) - Configuration Mailtrap (pour développement)
# SMTP_HOST="smtp.mailtrap.io"
# SMTP_PORT=2525
# SMTP_USER="votre-username-mailtrap"
# SMTP_PASSWORD="votre-password-mailtrap"
```

**Générer AUTH_SECRET** :

```bash
openssl rand -base64 32
```

**Créer un App Password Gmail** :

1. Allez sur https://myaccount.google.com/apppasswords
2. Générez un mot de passe d'application
3. Copiez-le dans `SMTP_PASSWORD`

### 5. Initialiser Prisma

```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables dans la base de données
npx prisma migrate dev --name init

# Seed la base avec des données de test
npx tsx seed.ts
```

### 6. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera disponible sur **http://localhost:3000**

---

## ⚙️ Configuration

### Configuration email

#### Gmail

1. Activez la vérification en 2 étapes sur votre compte Google
2. Créez un "App Password" : https://myaccount.google.com/apppasswords
3. Ajoutez les credentials dans `.env`

#### Mailtrap (pour tests)

1. Créez un compte sur https://mailtrap.io
2. Copiez les credentials SMTP
3. Ajoutez-les dans `.env`

### Configuration base de données

Pour PostgreSQL local :

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/dealio"
```

Pour Supabase :

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

---

## 🗄️ Schéma de base de données

### Modèles principaux

```prisma
// Énumération des rôles
enum Role {
  SUPERADMIN
  DIRECTEUR
  GERANT
  VENDEUR
  MAGASINIER
}

// Commerce (Tenant)
model Tenant {
  id          String   @id @default(cuid())
  name        String   @unique
  domain      String?  @unique
  createdAt   DateTime @default(now())

  users       User[]
  products    Product[]
  sales       Sale[]
}

// Utilisateur
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  name              String?
  password          String
  role              Role      @default(VENDEUR)
  emailVerified     DateTime? // Vérification email
  verificationToken String?   @unique
  twoFactorEnabled  Boolean   @default(false)
  twoFactorSecret   String?

  tenantId          String
  tenant            Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  sales             Sale[]
}

// Produit
model Product {
  id          String   @id @default(cuid())
  name        String
  price       Float
  stock       Int      @default(0)

  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  saleItems   SaleItem[]
}

// Vente
model Sale {
  id          String   @id @default(cuid())
  totalAmount Float
  createdAt   DateTime @default(now())

  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  userId      String
  user        User     @relation(fields: [userId], references: [id])

  items       SaleItem[]
}

// Item de vente
model SaleItem {
  id        String  @id @default(cuid())
  quantity  Int
  price     Float

  saleId    String
  sale      Sale    @relation(fields: [saleId], references: [id], onDelete: Cascade)

  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

### Relations

- Un **Tenant** a plusieurs **Users**, **Products**, **Sales**
- Un **User** appartient à un **Tenant**
- Une **Sale** contient plusieurs **SaleItems**
- Un **SaleItem** référence un **Product**

---

## 📁 Structure du projet

```
dealio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── users/
│   │   │   │   ├── route.ts              # POST/GET utilisateurs
│   │   │   │   └── [id]/route.ts         # PATCH/DELETE utilisateur
│   │   │   ├── products/
│   │   │   │   ├── route.ts              # POST/GET produits
│   │   │   │   └── [id]/route.ts         # PATCH/DELETE produit
│   │   │   └── sales/
│   │   │       └── route.ts              # POST/GET ventes
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                # Layout principal
│   │   │   ├── page.tsx                  # Dashboard accueil
│   │   │   ├── team/page.tsx             # Gestion équipe
│   │   │   ├── products/page.tsx         # Gestion produits
│   │   │   ├── pos/page.tsx              # Point de vente
│   │   │   └── sales/page.tsx            # Historique ventes
│   │   ├── login/page.tsx                # Connexion
│   │   ├── signup/page.tsx               # Inscription
│   │   └── verify-email/page.tsx         # Vérification email
│   ├── components/
│   │   └── dashboard/
│   │       ├── Sidebar.tsx               # Menu latéral
│   │       ├── TopBar.tsx                # Barre supérieure
│   │       ├── StatsCards.tsx            # Cartes statistiques
│   │       ├── RecentSales.tsx           # Ventes récentes
│   │       ├── TeamStatus.tsx            # Statut équipe
│   │       ├── team/                     # Composants équipe
│   │       ├── products/                 # Composants produits
│   │       ├── pos/                      # Composants caisse
│   │       └── sales/                    # Composants ventes
│   ├── lib/
│   │   ├── prisma.ts                     # Client Prisma
│   │   └── email.ts                      # Service email
│   ├── auth.ts                           # Configuration NextAuth
│   └── types/
│       └── next-auth.d.ts                # Types NextAuth
├── prisma/
│   ├── schema.prisma                     # Schéma de base de données
│   └── seed.ts                           # Données de test
├── .env                                  # Variables d'environnement
├── .env.example                          # Exemple de configuration
├── next.config.ts                        # Configuration Next.js
├── tailwind.config.ts                    # Configuration Tailwind
├── tsconfig.json                         # Configuration TypeScript
├── package.json
└── README.md
```

---

## 🔐 Authentification et sécurité

### Flux d'inscription

1. L'utilisateur remplit le formulaire `/sign-up`
2. Le système crée un **Tenant** et un **User** (DIRECTEUR)
3. Un **token de vérification** est généré
4. Un **email** est envoyé avec un lien de vérification
5. L'utilisateur clique sur le lien → compte activé
6. Il peut maintenant se connecter

### Flux de connexion

1. L'utilisateur entre email et mot de passe sur `/sign-in`
2. NextAuth vérifie les credentials
3. Vérification que `emailVerified` n'est pas `null`
4. Création d'une session JWT
5. Redirection vers `/dashboard`

### Protection des routes

Toutes les pages du dashboard sont protégées par `middleware.ts` :

```typescript
// Redirection automatique vers /login si non authentifié
if (!session?.user) {
  redirect("/sign-in");
}
```

### Protection des API

Toutes les API routes vérifient :

```typescript
const session = await auth();
if (!session?.user) {
  return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
}

// Vérifier l'appartenance au tenant
const { tenantId } = session.user;
```

---

## 👔 Gestion des rôles (RBAC)

### Hiérarchie des rôles

```
SUPERADMIN (niveau 5)
    ↓
DIRECTEUR (niveau 4)
    ↓
GÉRANT (niveau 3)
    ↓
VENDEUR (niveau 2)
    ↓
MAGASINIER (niveau 1)
```

### Matrice des permissions

\*GÉRANT peut uniquement modifier/supprimer VENDEUR et MAGASINIER

### Menu dynamique

Le menu de la sidebar s'adapte automatiquement selon le rôle :

**DIRECTEUR** voit :

- Tableau de bord
- Équipe
- Ventes
- Stocks
- Rapports
- Sécurité
- Paramètres

**VENDEUR** voit :

- Tableau de bord
- Ventes (caisse)
- Stocks (lecture seule)

**MAGASINIER** voit :

- Tableau de bord
- Stocks (édition complète)
- Rapports

---

## 🔌 API Routes

### Utilisateurs

#### `POST /api/users`

Créer un utilisateur (DIRECTEUR ou GÉRANT uniquement)

**Body** :

```json
{
  "name": "Jean Dupont",
  "email": "jean@exemple.com",
  "role": "VENDEUR",
  "password": "motdepasse123"
}
```

**Réponse** :

```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": "clx...",
    "name": "Jean Dupont",
    "email": "jean@exemple.com",
    "role": "VENDEUR"
  }
}
```

#### `PATCH /api/users/[id]`

Modifier un utilisateur

**Body** :

```json
{
  "name": "Jean Martin",
  "role": "GERANT",
  "password": "nouveaumotdepasse" // Optionnel
}
```

#### `DELETE /api/users/[id]`

Supprimer un utilisateur

---

### Produits

#### `POST /api/products`

Créer un produit

**Body** :

```json
{
  "name": "Coca-Cola 33cl",
  "price": 2.5,
  "stock": 100
}
```

#### `PATCH /api/products/[id]`

Modifier un produit

**Body** :

```json
{
  "name": "Coca-Cola 50cl",
  "price": 3.0,
  "stock": 150
}
```

#### `DELETE /api/products/[id]`

Supprimer un produit

---

### Ventes

#### `POST /api/sales`

Créer une vente (transaction atomique)

**Body** :

```json
{
  "items": [
    {
      "productId": "clx...",
      "quantity": 2,
      "price": 2.5
    },
    {
      "productId": "cly...",
      "quantity": 1,
      "price": 5.0
    }
  ]
}
```

**Réponse** :

```json
{
  "message": "Vente enregistrée avec succès",
  "sale": {
    "id": "clz...",
    "totalAmount": 10.00,
    "createdAt": "2026-01-12T10:30:00.000Z",
    "items": [...]
  }
}
```

**Note** : La transaction Prisma garantit :

1. Vérification du stock disponible
2. Création de la vente
3. Création des items
4. Déduction du stock

Tout réussit ou tout échoue (rollback automatique).

---

## 💻 Utilisation

### Créer un compte

1. Allez sur **http://localhost:3000/signup**
2. Remplissez :
   - Nom complet
   - Email
   - Mot de passe (min. 8 caractères)
   - Nom du commerce
   - Domaine (optionnel)
3. Cliquez sur **"Créer mon commerce"**
4. ✅ Vous recevez un email de vérification
5. Cliquez sur le lien dans l'email
6. ✅ Compte activé ! Vous pouvez vous connecter

### Gérer son équipe

1. Connectez-vous en tant que **DIRECTEUR** ou **GÉRANT**
2. Allez sur **Dashboard → Équipe**
3. Cliquez sur **"Ajouter un membre"**
4. Choisissez le rôle (vous ne pouvez créer que des rôles inférieurs au vôtre)
5. Le membre reçoit ses identifiants

### Gérer les produits

1. Allez sur **Dashboard → Stocks**
2. Cliquez sur **"Ajouter un produit"**
3. Entrez : nom, prix, stock initial
4. ✅ Produit créé avec alertes automatiques de stock bas

### Faire une vente

1. Allez sur **Dashboard → Ventes** (ou POS)
2. Recherchez les produits
3. Cliquez pour les ajouter au panier
4. Ajustez les quantités avec +/-
5. Cliquez **"Valider la vente"**
6. ✅ Stock déduit automatiquement

### Consulter l'historique

1. Allez sur **Dashboard → Historique des ventes**
2. Filtrez par date, vendeur
3. Cliquez **"Détails"** pour voir une vente
4. Exportez en CSV pour la comptabilité

---

## 🎯 Scripts disponibles

```bash
# Développement
npm run dev              # Lancer le serveur de développement

# Build
npm run build            # Créer une version de production
npm run start            # Lancer la version de production

# Prisma
npx prisma generate      # Générer le client Prisma
npx prisma migrate dev   # Créer une migration
npx prisma studio        # Interface graphique Prisma
npm run seed             # Seed la base de données

# Linting
npm run lint             # Vérifier le code
```

---

## 🐳 Déploiement

### Déploiement sur Vercel

1. **Push sur GitHub**

```bash
git push origin main
```

2. **Importer sur Vercel**

   - Allez sur https://vercel.com
   - Importez votre repository
   - Ajoutez les variables d'environnement

3. **Configurer PostgreSQL**

   - Utilisez Vercel Postgres ou Supabase
   - Copiez `DATABASE_URL` dans les variables d'environnement

4. **Déployer**
   - Vercel build et déploie automatiquement
   - Exécutez les migrations : `npx prisma migrate deploy`

### Variables d'environnement (Production)

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="votre-secret-securise"
NEXT_PUBLIC_APP_URL="https://votre-domaine.com"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre-email@gmail.com"
SMTP_PASSWORD="votre-app-password"
```

---

## 🧪 Tests

### Créer des données de test

```bash
npm run seed
```

Cela créera :

- 1 SUPERADMIN
- 2 DIRECTEURS avec leurs commerces
- 5 utilisateurs par commerce (rôles variés)
- 20 produits par commerce
- 50 ventes simulées

### Comptes de test

```
SUPERADMIN:
Email: superadmin@saas.com
Password: password123

DIRECTEUR 1:
Email: directeurA@test.com
Password: password123

DIRECTEUR 2:
Email: directeurB@test.com
Password: password123
```

---

## 🤝 Contributeurs

- **Développeur principal** : AKOUETE Kaleb (follivios@gmail.com)
- **Technologies** : Next.js, Prisma, PostgreSQL, NextAuth
- **Année** : 2026

## 🎓 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [DaisyUI](https://daisyui.com)

---
