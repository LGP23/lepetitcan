import { prisma } from '@/lib/db'
import { addDays, addHours, differenceInDays, differenceInHours, isBefore } from 'date-fns'

async function main() {
  const now = new Date()

  const appointments = await prisma.appointment.findMany({
    where: {
      status: { in: ['confirmed', 'in_progress'] },
      startDateTime: { gte: now },
    },
    include: { owner: true, pet: true },
  })

  for (const apt of appointments) {
    const daysUntil = differenceInDays(apt.startDateTime, now)
    const hoursUntil = differenceInHours(apt.startDateTime, now)

    // Faltan 2 días
    if (daysUntil === 2 && !apt.reminder2dSent) {
      await prisma.notification.create({
        data: {
          type: 'two_days_before',
          channel: apt.owner.prefChannel,
          ownerId: apt.ownerId,
          recipient: apt.owner.phone || apt.owner.email || '',
          title: 'Faltan 2 días',
          body: `Faltan 2 días para la cita de ${apt.pet.name} (${apt.startDateTime.toLocaleDateString('es-ES')}).`,
          status: 'pending',
          metadata: { appointmentId: apt.id, petName: apt.pet.name },
        },
      })
      await prisma.appointment.update({ where: { id: apt.id }, data: { reminder2dSent: true } })
    }

    // Falta 1 día
    if (daysUntil === 1 && !apt.reminder1dSent) {
      await prisma.notification.create({
        data: {
          type: 'one_day_before',
          channel: apt.owner.prefChannel,
          ownerId: apt.ownerId,
          recipient: apt.owner.phone || apt.owner.email || '',
          title: 'Falta 1 día',
          body: `Mañana es la cita de ${apt.pet.name} a las ${apt.startDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}.`,
          status: 'pending',
          metadata: { appointmentId: apt.id, petName: apt.pet.name },
        },
      })
      await prisma.appointment.update({ where: { id: apt.id }, data: { reminder1dSent: true } })
    }

    // Faltan 2 horas
    if (hoursUntil <= 2 && hoursUntil > 0 && !apt.reminder2hSent) {
      await prisma.notification.create({
        data: {
          type: 'two_hours_before',
          channel: apt.owner.prefChannel,
          ownerId: apt.ownerId,
          recipient: apt.owner.phone || apt.owner.email || '',
          title: '¡En 2 horas!',
          body: `${apt.pet.name} te espera en 2 horas.`,
          status: 'pending',
          metadata: { appointmentId: apt.id, petName: apt.pet.name },
        },
      })
      await prisma.appointment.update({ where: { id: apt.id }, data: { reminder2hSent: true } })
    }
  }

  console.log(`Reminders processed: ${appointments.length} appointments checked`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
