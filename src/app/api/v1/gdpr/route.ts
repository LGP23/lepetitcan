import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  const body = await request.json()
  const { action, type, description } = body

  const owner = await prisma.owner.findUnique({ where: { userId: session.user.id } })
  if (!owner) {
    return NextResponse.json({ error: { message: 'Perfil no encontrado' } }, { status: 404 })
  }

  switch (action) {
    case 'consent': {
      const record = await prisma.consentRecord.create({
        data: {
          type: type || 'marketing',
          version: '1.0',
          accepted: true,
          textShown: 'Consentimiento registrado desde la app',
          ownerId: owner.id,
        },
      })
      return NextResponse.json({ data: record })
    }

    case 'revoke_consent': {
      const record = await prisma.consentRecord.create({
        data: {
          type: type || 'marketing',
          version: '1.0',
          accepted: false,
          revokedAt: new Date(),
          textShown: 'Consentimiento revocado desde la app',
          ownerId: owner.id,
        },
      })
      return NextResponse.json({ data: record })
    }

    case 'request_deletion': {
      const request = await prisma.dataDeletionRequest.create({
        data: {
          requestType: type || 'deletion',
          description: description || 'Solicitud de eliminación de datos',
          ownerId: owner.id,
        },
      })
      return NextResponse.json({ data: request })
    }

    case 'export': {
      const [pets, appointments, tickets, invoices] = await Promise.all([
        prisma.pet.findMany({ where: { owners: { some: { ownerId: owner.id } } } }),
        prisma.appointment.findMany({
          where: { ownerId: owner.id },
          include: { service: true, pet: true },
        }),
        prisma.ticket.findMany({
          where: { appointment: { ownerId: owner.id } },
        }),
        prisma.invoice.findMany({
          where: { ticket: { appointment: { ownerId: owner.id } } },
        }),
      ])

      const exportData = {
        owner: { name: owner.name, email: owner.email, phone: owner.phone },
        pets,
        appointments: appointments.map((a) => ({
          date: a.startDateTime,
          service: a.service.name,
          pet: a.pet.name,
          status: a.status,
        })),
        tickets,
        invoices,
        exportedAt: new Date().toISOString(),
      }

      return NextResponse.json({ data: exportData })
    }

    default:
      return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 })
  }
}

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const owner = await prisma.owner.findUnique({
    where: { userId: session.user.id },
    include: {
      consentRecords: { orderBy: { createdAt: 'desc' } },
      dataDeletionRequests: { orderBy: { createdAt: 'desc' } },
    },
  })

  return NextResponse.json({ data: owner })
}
