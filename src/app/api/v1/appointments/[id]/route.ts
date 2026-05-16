import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { completeAppointment } from '@/lib/services/appointment.service'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id },
    include: {
      owner: true,
      pet: true,
      service: true,
      staff: { select: { id: true, name: true } },
      ticket: { include: { invoice: true, refunds: true } },
    },
  })

  if (!appointment) {
    return NextResponse.json({ error: { message: 'Cita no encontrada' } }, { status: 404 })
  }

  return NextResponse.json({ data: appointment })
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  const body = await request.json()
  const { status, startDateTime, endDateTime, notes, actualHours } = body

  if (status === 'completed') {
    const result = await completeAppointment(params.id)
    return NextResponse.json({ data: result })
  }

  const appointment = await prisma.appointment.update({
    where: { id: params.id },
    data: {
      status: status || undefined,
      startDateTime: startDateTime ? new Date(startDateTime) : undefined,
      endDateTime: endDateTime ? new Date(endDateTime) : undefined,
      notes: notes !== undefined ? notes : undefined,
      actualHours: actualHours !== undefined ? actualHours : undefined,
    },
  })

  await prisma.auditLog.create({
    data: {
      action: `appointment.${status || 'update'}`,
      entityType: 'appointment',
      entityId: appointment.id,
      userId: session.user.id,
      details: { changes: Object.keys(body) },
    },
  })

  return NextResponse.json({ data: appointment })
}
