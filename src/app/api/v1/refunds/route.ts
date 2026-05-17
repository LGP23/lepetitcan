import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const createRefundSchema = z.object({
  ticketId: z.string(),
  amount: z.number().positive(),
  reason: z.string().min(1),
  refundMethod: z.enum(['cash', 'card', 'bizum']),
  isPartial: z.boolean().default(false),
})

export async function GET(request: Request) {
  const session = await auth()
  if (!session || session.user.role === 'cliente') {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  const refunds = await prisma.refund.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      ticket: {
        include: {
          appointment: {
            include: {
              owner: { select: { name: true } },
              pet: { select: { name: true } },
            },
          },
        },
      },
    },
  })

  return NextResponse.json({ data: refunds })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = createRefundSchema.parse(body)

    const ticket = await prisma.ticket.findUnique({ where: { id: data.ticketId } })
    if (!ticket) {
      return NextResponse.json({ error: { message: 'Ticket no encontrado' } }, { status: 404 })
    }

    const refund = await prisma.refund.create({ data })

    await prisma.ticket.update({
      where: { id: data.ticketId },
      data: { paymentStatus: data.isPartial ? 'paid' : 'refunded' },
    })

    await prisma.auditLog.create({
      data: {
        action: 'refund.create',
        entityType: 'refund',
        entityId: refund.id,
        userId: session.user.id,
        details: JSON.stringify({ ticketId: data.ticketId, amount: data.amount, reason: data.reason }),
      },
    })

    return NextResponse.json({ data: refund }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: { message: error.errors[0].message } }, { status: 400 })
    }
    return NextResponse.json({ error: { message: 'Error al procesar devolución' } }, { status: 500 })
  }
}
