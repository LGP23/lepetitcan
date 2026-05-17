import { prisma } from '@/lib/db'
import { addWeeks, startOfDay, endOfDay } from 'date-fns'

async function main() {
  const sixWeeksAgo = addWeeks(new Date(), -6)
  const dayStart = startOfDay(sixWeeksAgo)
  const dayEnd = endOfDay(sixWeeksAgo)

  const appointments = await prisma.appointment.findMany({
    where: {
      status: 'completed',
      completedAt: { gte: dayStart, lte: dayEnd },
      ticket: { isNot: null },
    },
    include: { owner: true, pet: true },
  })

  for (const apt of appointments) {
    const existing = await prisma.notification.findFirst({
      where: { type: 'six_weeks_followup', ownerId: apt.ownerId, 'metadata': { path: ['appointmentId'], equals: apt.id } },
    })
    if (existing) continue

    await prisma.notification.create({
      data: {
        type: 'six_weeks_followup',
        channel: apt.owner.prefChannel,
        ownerId: apt.ownerId,
        recipient: apt.owner.phone || apt.owner.email || '',
        title: '¿Volvemos a vernos?',
        body: `Hace 6 semanas ${apt.pet.name} visitó Le Petit Can. ¿Quieres reservar su próxima cita?`,
        status: 'pending',
        metadata: { appointmentId: apt.id, petName: apt.pet.name },
      },
    })
  }

  console.log(`6-Week follow-ups: ${appointments.length} reminders created`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
