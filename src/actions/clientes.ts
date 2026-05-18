'use server'

import { prisma } from '@/lib/db'

export async function getClientes() {
  return prisma.owner.findMany({
    orderBy: { name: 'asc' },
    include: {
      pets: {
        include: { pet: true }
      }
    }
  })
}

export async function getClienteById(id: string) {
  return prisma.owner.findUnique({
    where: { id },
    include: {
      pets: { include: { pet: true } },
      appointments: {
        include: { pet: true, service: true },
        orderBy: { startDateTime: 'desc' }
      }
    }
  })
}

export async function createCliente(data: any) {
  return prisma.owner.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      source: data.source || 'presencial',
      prefChannel: data.prefChannel || 'whatsapp'
    }
  })
}

export async function searchClientes(query: string) {
  return prisma.owner.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { phone: { contains: query } },
        { email: { contains: query } },
      ],
    },
    take: 10,
    include: {
      pets: { include: { pet: true } },
    },
  })
}
