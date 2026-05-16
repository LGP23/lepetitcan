import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

const publicBookingSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  source: z.enum(['web', 'whatsapp', 'instagram', 'facebook', 'sms', 'phone', 'presencial', 'ai_agent']).default('web'),
  petName: z.string().min(1),
  petBreed: z.string().optional(),
  petSize: z.enum(['toy', 'pequeno', 'mediano', 'grande', 'gigante']),
  serviceId: z.string(),
  preferredDate: z.string(),
  preferredTime: z.string(),
  notes: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = publicBookingSchema.parse(body)

    let owner = await prisma.owner.findFirst({
      where: {
        OR: [
          { email: data.email || '' },
          { phone: data.phone || '' },
        ].filter((o) => Object.values(o)[0]),
      },
    })

    if (!owner) {
      owner = await prisma.owner.create({
        data: {
          name: data.name,
          email: data.email || null,
          phone: data.phone || null,
          source: data.source,
        },
      })
    }

    let pet = await prisma.pet.findFirst({
      where: {
        name: data.petName,
        owners: { some: { ownerId: owner.id } },
      },
    })

    if (!pet) {
      pet = await prisma.pet.create({
        data: {
          name: data.petName,
          breed: data.petBreed || null,
          size: data.petSize,
          owners: {
            create: { ownerId: owner.id, isPrimary: true },
          },
        },
      })
    }

    const staff = await prisma.user.findFirst({
      where: { role: { in: ['admin', 'peluquero'] }, isActive: true },
    })

    if (!staff) {
      return NextResponse.json(
        { error: { message: 'No hay personal disponible' } },
        { status: 503 }
      )
    }

    const startDateTime = new Date(`${data.preferredDate}T${data.preferredTime}:00`)
    const endDateTime = new Date(startDateTime)
    endDateTime.setHours(endDateTime.getHours() + 1)

    const bookingToken = uuidv4()

    const appointment = await prisma.appointment.create({
      data: {
        ownerId: owner.id,
        petId: pet.id,
        serviceId: data.serviceId,
        staffId: staff.id,
        startDateTime,
        endDateTime,
        status: 'pending',
        source: data.source,
        bookingToken,
        notes: data.notes || null,
      },
      include: { owner: true, pet: true, service: true },
    })

    await prisma.notification.create({
      data: {
        type: 'appointment_confirmation',
        channel: owner.prefChannel || 'whatsapp',
        ownerId: owner.id,
        recipient: owner.phone || owner.email || '',
        title: 'Solicitud de cita recibida',
        body: `Hola ${owner.name}, hemos recibido tu solicitud de cita para ${pet.name}. Te confirmaremos pronto. 🐾`,
        status: 'pending',
        metadata: { appointmentId: appointment.id, petName: pet.name },
      },
    })

    return NextResponse.json({
      data: {
        id: appointment.id,
        message: 'Solicitud recibida. Te contactaremos para confirmar.',
        token: bookingToken,
      },
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: error.errors[0].message } },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: { message: 'Error al procesar la solicitud' } },
      { status: 500 }
    )
  }
}
