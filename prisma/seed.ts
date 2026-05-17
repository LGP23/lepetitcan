import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('Admin123456!', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lepetitcan.es' },
    update: {},
    create: {
      email: 'admin@lepetitcan.es',
      passwordHash,
      name: 'Iliana Ortega',
      role: 'admin',
      owner: {
        create: {
          name: 'Iliana Ortega',
          email: 'iliana@lepetitcan.es',
          phone: '+34698130777',
          source: 'presencial',
        },
      },
    },
  })

  const staff = await prisma.user.upsert({
    where: { email: 'staff@lepetitcan.es' },
    update: {},
    create: {
      email: 'staff@lepetitcan.es',
      passwordHash,
      name: 'Staff Le Petit Can',
      role: 'peluquero' ,
    },
  })

  const servicios = [
    {
      name: 'Corte de Pelo',
      description: 'Corte personalizado para cada raza y estilo',
      durationMin: 60,
      pricingModel: 'fixed' ,
      priceToy: 30,
      pricePequeno: 35,
      priceMediano: 40,
      priceGrandeFixed: 50,
      priceGrandeHourly: 35,
      priceGiganteHourly: 45,
      sortOrder: 1,
    },
    {
      name: 'Baño Completo',
      description: 'Baño con productos hipoalergénicos, champú nutritivo y acondicionador',
      durationMin: 45,
      pricingModel: 'fixed' ,
      priceToy: 20,
      pricePequeno: 25,
      priceMediano: 30,
      priceGrandeFixed: 40,
      priceGrandeHourly: null,
      priceGiganteHourly: 50,
      sortOrder: 2,
    },
    {
      name: 'Desenredado y Deslanado',
      description: 'Eliminación de nudos y enredos con herramientas especializadas',
      durationMin: 90,
      pricingModel: 'hourly' ,
      priceToy: null,
      pricePequeno: null,
      priceMediano: null,
      priceGrandeFixed: null,
      priceGrandeHourly: 30,
      priceGiganteHourly: 30,
      sortOrder: 3,
    },
    {
      name: 'Corte de Uñas',
      description: 'Mantenimiento de uñas con instrumentos profesionales',
      durationMin: 15,
      pricingModel: 'fixed' ,
      priceToy: 10,
      pricePequeno: 12,
      priceMediano: 12,
      priceGrandeFixed: 15,
      priceGrandeHourly: null,
      priceGiganteHourly: 18,
      sortOrder: 4,
    },
    {
      name: 'Limpieza de Oídos',
      description: 'Limpieza profunda con productos específicos no irritantes',
      durationMin: 15,
      pricingModel: 'fixed' ,
      priceToy: 10,
      pricePequeno: 10,
      priceMediano: 12,
      priceGrandeFixed: 15,
      priceGrandeHourly: null,
      priceGiganteHourly: 15,
      sortOrder: 5,
    },
    {
      name: 'Cepillado Dental',
      description: 'Higiene bucal para prevención de sarro y enfermedades',
      durationMin: 15,
      pricingModel: 'fixed' ,
      priceToy: 10,
      pricePequeno: 12,
      priceMediano: 12,
      priceGrandeFixed: 15,
      priceGrandeHourly: null,
      priceGiganteHourly: 18,
      sortOrder: 6,
    },
    {
      name: 'Baño Spa & Arreglo',
      description: 'Experiencia spa completa con productos premium',
      durationMin: 120,
      pricingModel: 'fixed' ,
      priceToy: 45,
      pricePequeno: 50,
      priceMediano: 60,
      priceGrandeFixed: 80,
      priceGrandeHourly: null,
      priceGiganteHourly: 60,
      sortOrder: 7,
    },
    {
      name: 'Stripping Terriers',
      description: 'Técnica de stripping para terriers',
      durationMin: 120,
      pricingModel: 'fixed' ,
      priceToy: null,
      pricePequeno: null,
      priceMediano: 55,
      priceGrandeFixed: 75,
      priceGrandeHourly: null,
      priceGiganteHourly: 55,
      sortOrder: 8,
    },
  ]

  for (const s of servicios) {
    await prisma.serviceCatalog.upsert({
      where: { id: s.name },
      update: s,
      create: { id: s.name, ...s },
    })
  }

  const productos = [
    { name: 'Champú Spa Calmante 250ml', price: 25, category: 'Champús' },
    { name: 'Champú Spa Calmante 500ml', price: 38, category: 'Champús' },
    { name: 'Acondicionador Hydra 250ml', price: 25, category: 'Acondicionadores' },
    { name: 'Acondicionador Hydra 500ml', price: 38, category: 'Acondicionadores' },
    { name: 'Pack Spa Completo', price: 65, category: 'Kits' },
    { name: 'Peine Grooming Pro', price: 18, category: 'Herramientas' },
    { name: 'Carda Grooming Pro', price: 22, category: 'Herramientas' },
    { name: 'Perfume Canino 100ml', price: 15, category: 'Perfumes' },
  ]

  for (const p of productos) {
    await prisma.product.upsert({
      where: { id: p.name },
      update: p,
      create: { id: p.name, ...p },
    })
  }

  console.log('Seed completado correctamente')
  console.log(`Admin: admin@lepetitcan.es / Admin123456!`)
  console.log(`Staff: staff@lepetitcan.es / Admin123456!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
