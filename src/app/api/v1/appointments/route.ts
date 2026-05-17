import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const createAppointmentSchema = z.object({
  ownerId: z.string(),
  petId: z.string(),
  serviceId: z.string(),
  staffId: z.string(),
  startDateTime: z.string(),
  endDateTime: z.string(),
  priceType: z.enum(['fixed', 'hourly']).default('fixed'),
  estimatedHours: z.number().optional(),
  notes: z.string().optional(),
  source: z.enum(['web', 'whatsapp', 'instagram', 'facebook', 'sms', 'phone', 'presencial', 'ai_agent']).default('presencial'),
})

export async function GET(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const staffId = searchParams.get('staffId')
  const ownerId = searchParams.get('ownerId')
  const status = searchParams.get('status')

  const where: any = {}

  if (session.user.role === 'cliente') {
    const owner = await prisma.owner.findUnique({ where: { userId: session.user.id } })
    if (owner) where.ownerId = owner.id
    else return NextResponse.json({ data: [] })
  }

  if (date) {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)
    where.startDateTime = { gte: start, lte: end }
  }

  if (staffId) where.staffId = staffId
  if (ownerId) where.ownerId = ownerId
  if (status) where.status = status

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      owner: true,
      pet: true,
      service: true,
      staff: { select: { id: true, name: true } },
      ticket: true,
    },
    orderBy: { startDateTime: 'asc' },
  })

  return NextResponse.json({ data: appointments })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = createAppointmentSchema.parse(body)

    const appointment = await prisma.appointment.create({
      data: {
        ownerId: data.ownerId,
        petId: data.petId,
        serviceId: data.serviceId,
        staffId: data.staffId,
        startDateTime: new Date(data.startDateTime),
        endDateTime: new Date(data.endDateTime),
        priceType: data.priceType,
        estimatedHours: data.estimatedHours || null,
        notes: data.notes || null,
        source: data.source,
        status: 'pending',
      },
      include: {
        owner: true,
        pet: true,
        service: true,
        staff: { select: { id: true, name: true } },
      },
    })

    await prisma.auditLog.create({
      data: {
        action: 'appointment.create',
        entityType: 'appointment',
        entityId: appointment.id,
        userId: session.user.id,
        details: JSON.stringify({
          petId: data.petId,
          serviceId: data.serviceId,
          startDateTime: data.startDateTime,
        }),
      },
    })

    return NextResponse.json({ data: appointment }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: error.errors[0].message } },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: { message: 'Error al crear cita' } },
      { status: 500 }
    )
  }
}
