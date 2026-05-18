'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function getMascotas() {
  return prisma.pet.findMany({
    orderBy: { name: 'asc' },
    include: {
      owners: { include: { owner: true } }
    }
  })
}

export async function getMascotaById(id: string) {
  return prisma.pet.findUnique({
    where: { id },
    include: {
      owners: { include: { owner: true } },
      appointments: {
        include: { service: true, staff: true },
        orderBy: { startDateTime: 'desc' }
      }
    }
  })
}

export async function createMascota(data: any, ownerId: string) {
  return prisma.pet.create({
    data: {
      name: data.name,
      breed: data.breed,
      size: data.size,
      notes: data.notes,
      owners: {
        create: {
          ownerId: ownerId,
          isPrimary: true
        }
      }
    }
  })
}

export async function getClientPetsAction() {
  const session = await auth()
  if (!session || !session.user) {
    throw new Error('Not authenticated')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { ownerId: true }
  })

  if (!user || !user.ownerId) {
    return []
  }

  // Find all pets associated with this owner
  const petOwners = await prisma.petOwner.findMany({
    where: { ownerId: user.ownerId },
    include: {
      pet: {
        include: {
          appointments: {
            orderBy: { startDateTime: 'desc' },
            take: 1
          }
        }
      }
    }
  })

  return petOwners.map(po => {
    const pet = po.pet
    const lastApt = pet.appointments[0]
    return {
      id: pet.id,
      name: pet.name,
      breed: pet.breed || 'Sin raza',
      size: pet.size,
      notes: pet.notes || '',
      birthDate: pet.birthDate ? pet.birthDate.toLocaleDateString('es-ES') : 'N/A',
      lastVisit: lastApt ? lastApt.startDateTime.toLocaleDateString('es-ES') : 'Ninguna'
    }
  })
}
