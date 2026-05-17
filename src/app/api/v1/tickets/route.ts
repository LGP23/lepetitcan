import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const TICKET_PREFIX = 'T'
const TICKET_PADDING = 6

async function generateTicketNumber(): Promise<string> {
  const last = await prisma.ticket.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { number: true },
  })

  let nextNum = 1
  if (last) {
    const lastNum = parseInt(last.number.replace(`${TICKET_PREFIX}-`, ''), 10)
    nextNum = lastNum + 1
  }

  return `${TICKET_PREFIX}-${nextNum.toString().padStart(TICKET_PADDING, '0')}`
}

const createTicketSchema = z.object({
  appointmentId: z.string(),
  paymentMethod: z.enum(['cash', 'card', 'bizum']),
  paymentStatus: z.enum(['pending', 'paid', 'refunded']).default('paid'),
  totalAmount: z.number().positive(),
})

export async function GET(request: Request) {
  const session = await auth()
  if (!session || session.user.role === 'cliente') {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        appointment: {
          include: {
            pet: { select: { name: true } },
            owner: { select: { name: true } },
          },
        },
        invoice: true,
      },
    }),
    prisma.ticket.count(),
  ])

  return NextResponse.json({
    data: tickets,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || session.user.role === 'cliente') {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = createTicketSchema.parse(body)

    const appointment = await prisma.appointment.findUnique({
      where: { id: data.appointmentId },
      include: { ticket: true },
    })

    if (!appointment) {
      return NextResponse.json({ error: { message: 'Cita no encontrada' } }, { status: 404 })
    }
    if (appointment.ticket) {
      return NextResponse.json({ error: { message: 'La cita ya tiene un ticket' } }, { status: 409 })
    }

    const number = await generateTicketNumber()

    const ticket = await prisma.ticket.create({
      data: {
        number,
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        appointmentId: data.appointmentId,
      },
      include: {
        appointment: {
          include: { pet: true, owner: true, service: true },
        },
      },
    })

    await prisma.appointment.update({
      where: { id: data.appointmentId },
      data: { status: 'completed', totalAmount: data.totalAmount },
    })

    return NextResponse.json({ data: ticket }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: { message: error.errors[0].message } }, { status: 400 })
    }
    return NextResponse.json({ error: { message: 'Error al crear ticket' } }, { status: 500 })
  }
}
