import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const staff = await prisma.user.findFirst({ where: { role: 'peluquero' } })
  if (!staff) {
    console.log('No staff found. Run npm run db:seed first.')
    return
  }

  const service1 = await prisma.serviceCatalog.findFirst({ where: { name: 'Corte de Pelo' } })
  const service2 = await prisma.serviceCatalog.findFirst({ where: { name: 'Baño Completo' } })
  if (!service1 || !service2) return

  // Create a dummy owner
  const owner = await prisma.owner.upsert({
    where: { id: 'dummy-owner-1' },
    update: {},
    create: {
      id: 'dummy-owner-1',
      name: 'Ana García',
      phone: '+34 698 13 07 77',
      source: 'presencial',
    },
  })

  // Create dummy pets
  const pet1 = await prisma.pet.upsert({
    where: { id: 'dummy-pet-1' },
    update: {},
    create: {
      id: 'dummy-pet-1',
      name: 'Kira',
      size: 'pequeno',
      owners: {
        create: {
          ownerId: owner.id,
          isPrimary: true
        }
      }
    },
  })

  const pet2 = await prisma.pet.upsert({
    where: { id: 'dummy-pet-2' },
    update: {},
    create: {
      id: 'dummy-pet-2',
      name: 'Thor',
      size: 'grande',
      owners: {
        create: {
          ownerId: owner.id,
          isPrimary: true
        }
      }
    },
  })

  // Create appointments for today
  const today = new Date()
  today.setHours(9, 30, 0, 0)
  
  await prisma.appointment.create({
    data: {
      status: 'pending',
      startDateTime: today,
      endDateTime: new Date(today.getTime() + 60 * 60 * 1000),
      ownerId: owner.id,
      petId: pet1.id,
      serviceId: service1.id,
      staffId: staff.id,
    }
  })

  const today2 = new Date()
  today2.setHours(12, 0, 0, 0)

  await prisma.appointment.create({
    data: {
      status: 'in_progress',
      startDateTime: today2,
      endDateTime: new Date(today2.getTime() + 60 * 60 * 1000),
      ownerId: owner.id,
      petId: pet2.id,
      serviceId: service2.id,
      staffId: staff.id,
    }
  })

  console.log('Dummy data seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
