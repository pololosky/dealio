import { prisma } from "./lib/prisma"
import * as bcrypt from 'bcryptjs'

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  console.log('--- Début du Seeding Multi-tenant ---')

  // 1. Création du Superadmin (Tenant Global) [cite: 8, 28]
  const superAdminEntry = await prisma.tenant.create({
    data: {
      name: 'Administration Centrale',
      domain: 'admin.saas.com',
      users: {
        create: {
          email: 'superadmin@saas.com',
          password: hashedPassword,
          role: 'SUPERADMIN',
          twoFactorEnabled: true, // 2FA obligatoire 
        },
      },
    },
    include: {
      users: true,
    },
  })
  console.log('Superadmin créé:', superAdminEntry.users[0].email)

  // 2. Création du Commerce A (Directeur A + Produits) [cite: 9, 16, 43]
  const shopA = await prisma.tenant.create({
    data: {
      name: 'Boutique Mode Paris',
      domain: 'mode-paris',
      users: {
        create: {
          email: 'directeurA@test.com',
          password: hashedPassword,
          role: 'DIRECTEUR',
          twoFactorEnabled: true,
        },
      },
      products: {
        create: [
          { name: 'Veste en Cuir', price: 120.0, stock: 15 },
          { name: 'Pantalon Chino', price: 55.0, stock: 40 },
        ],
      },
    },
    include: {
      users: true,
      products: true,
    },
  })
  console.log(`Boutique A créée avec ${shopA.products.length} produits.`)

  // 3. Création du Commerce B (Directeur B + Produits) [cite: 16, 43]
  const shopB = await prisma.tenant.create({
    data: {
      name: 'Épicerie Fine Lyon',
      domain: 'lyon-epicerie',
      users: {
        create: {
          email: 'directeurB@test.com',
          password: hashedPassword,
          role: 'DIRECTEUR',
          twoFactorEnabled: true,
        },
      },
      products: {
        create: [
          { name: 'Huile d Olive Extra', price: 18.5, stock: 60 },
          { name: 'Miel de Montagne', price: 12.0, stock: 25 },
        ],
      },
    },
    include: {
      users: true,
      products: true,
    },
  })
  console.log(`Boutique B créée avec ${shopB.products.length} produits.`)

  // Affichage récapitulatif comme dans votre exemple
  const allTenants = await prisma.tenant.findMany({
    include: {
      users: true,
      products: true,
    },
  })
  console.log('--- Rapport Final de Seeding ---')
  console.log(JSON.stringify(allTenants, null, 2))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Erreur lors du seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })