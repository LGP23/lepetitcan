'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function getTicketsAction() {
  const session = await auth()
  if (!session || !session.user) {
    throw new Error('Not authenticated')
  }

  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      appointment: {
        include: {
          owner: true,
          pet: true,
          service: true
        }
      }
    }
  })

  return tickets.map(t => {
    const subtotal = t.totalAmount / 1.21
    const iva = t.totalAmount - subtotal
    return {
      id: t.id,
      number: t.number,
      clientName: t.appointment.owner.name,
      petName: t.appointment.pet.name,
      serviceName: t.appointment.service.name,
      date: t.createdAt.toLocaleDateString('es-ES'),
      paymentMethod: t.paymentMethod,
      base: subtotal,
      iva: iva,
      total: t.totalAmount
    }
  })
}
