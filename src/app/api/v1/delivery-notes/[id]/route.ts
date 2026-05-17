import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

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
      staff: { select: { name: true } },
      ticket: { include: { invoice: true } },
      pipelineSteps: { orderBy: { sortOrder: 'asc' } },
    },
  })

  if (!appointment) {
    return NextResponse.json({ error: { message: 'Albarán no encontrado' } }, { status: 404 })
  }

  const deliveryNote = {
    number: `A-${appointment.createdAt.getFullYear()}-${appointment.id.slice(0, 6).toUpperCase()}`,
    date: appointment.createdAt,
    client: {
      name: appointment.owner.name,
      phone: appointment.owner.phone,
      email: appointment.owner.email,
    },
    pet: {
      name: appointment.pet.name,
      breed: appointment.pet.breed,
      size: appointment.pet.size,
    },
    service: {
      name: appointment.service.name,
      duration: `${appointment.service.durationMin} min`,
      priceType: appointment.priceType,
      estimatedHours: appointment.estimatedHours,
      actualHours: appointment.actualHours,
    },
    staff: appointment.staff.name,
    pipeline: appointment.pipelineSteps.map((s) => ({
      step: s.step,
      label: s.label,
      completedAt: s.completedAt,
    })),
    notes: appointment.notes,
    ticket: appointment.ticket
      ? {
          number: appointment.ticket.number,
          total: appointment.ticket.totalAmount,
          paymentMethod: appointment.ticket.paymentMethod,
          status: appointment.ticket.paymentStatus,
        }
      : null,
    invoice: appointment.ticket?.invoice
      ? {
          number: appointment.ticket.invoice.number,
          total: appointment.ticket.invoice.total,
          cif: appointment.ticket.invoice.cif,
        }
      : null,
  }

  return NextResponse.json({ data: deliveryNote })
}
