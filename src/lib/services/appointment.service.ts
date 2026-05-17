import { prisma } from '@/lib/db'
import { calculatePrice } from '@/lib/utils/pricing'
import { PetSize } from '@prisma/client'
import { addDays, addHours, startOfDay, endOfDay, parseISO } from 'date-fns'

export interface CreateAppointmentInput {
  ownerId: string
  petId: string
  serviceId: string
  staffId: string
  startDateTime: string
  durationMin: number
  notes?: string
  source?: string
}

export async function getAvailableSlots(date: string, staffId: string, durationMin: number = 60) {
  const dayStart = startOfDay(parseISO(date))
  const dayEnd = endOfDay(parseISO(date))

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      staffId,
      startDateTime: { gte: dayStart, lte: dayEnd },
      status: { notIn: ['cancelled'] },
    },
    select: { startDateTime: true, endDateTime: true },
  })

  const businessHours = { start: 9, end: 16 }
  const slots: { time: string; available: boolean }[] = []

  for (let h = businessHours.start; h < businessHours.end; h++) {
    for (let m = 0; m < 60; m += durationMin) {
      const slotStart = new Date(parseISO(date))
      slotStart.setHours(h, m, 0, 0)
      const slotEnd = new Date(slotStart)
      slotEnd.setMinutes(slotEnd.getMinutes() + durationMin)

      const isBooked = existingAppointments.some(
        (apt) => slotStart < apt.endDateTime && slotEnd > apt.startDateTime
      )

      slots.push({
        time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
        available: !isBooked,
      })
    }
  }

  return slots
}

export async function completeAppointment(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { pet: true, service: true },
  })

  if (!appointment) throw new Error('Cita no encontrada')

  const priceResult = calculatePrice({
    size: appointment.pet.size as PetSize,
    service: appointment.service,
    hours: Number(appointment.actualHours) || undefined,
  })

  const [updated] = await prisma.$transaction([
    prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        totalAmount: priceResult.price,
        actualHours: priceResult.totalHours ? priceResult.totalHours : appointment.actualHours,
      },
    }),
  ])

  return { appointment: updated, priceResult }
}

export async function processPipelineStep(appointmentId: string, step: string) {
  const existing = await prisma.appointmentPipelineStep.findUnique({
    where: { appointmentId_step: { appointmentId, step } },
  })

  if (existing) {
    return prisma.appointmentPipelineStep.update({
      where: { id: existing.id },
      data: { completedAt: existing.completedAt ? null : new Date() },
    })
  }

  return prisma.appointmentPipelineStep.create({
    data: { appointmentId, step, label: step, completedAt: new Date() },
  })
}
