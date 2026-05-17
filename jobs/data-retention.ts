import { prisma } from '@/lib/db'
import { subYears, subMonths } from 'date-fns'

async function main() {
  const now = new Date()

  // Anonimizar owners sin actividad > 5 años
  const fiveYearsAgo = subYears(now, 5)
  const oldOwners = await prisma.owner.findMany({
    where: {
      createdAt: { lte: fiveYearsAgo },
      appointments: { none: { createdAt: { gte: fiveYearsAgo } } },
    },
    include: { appointments: { take: 1, orderBy: { createdAt: 'desc' } } },
  })

  for (const owner of oldOwners) {
    const hasRecentAppointment = owner.appointments.some((a) => a.createdAt >= fiveYearsAgo)
    if (!hasRecentAppointment) {
      await prisma.owner.update({
        where: { id: owner.id },
        data: {
          name: '[ANONYMIZED]',
          email: null,
          phone: null,
          address: null,
          notes: null,
          dataRetentionUntil: now,
        },
      })
      console.log(`Anonymized owner: ${owner.id}`)
    }
  }

  // Eliminar fotos de mascotas sin actividad > 1 año
  const oneYearAgo = subYears(now, 1)
  const oldPets = await prisma.pet.findMany({
    where: {
      photoUrl: { not: null },
      appointments: { none: { createdAt: { gte: oneYearAgo } } },
    },
  })

  for (const pet of oldPets) {
    await prisma.pet.update({
      where: { id: pet.id },
      data: { photoUrl: null },
    })
    console.log(`Removed photo for pet: ${pet.id}`)
  }

  // Eliminar logs de auditoría > 2 años
  const twoYearsAgo = subYears(now, 2)
  const deletedLogs = await prisma.auditLog.deleteMany({
    where: { createdAt: { lte: twoYearsAgo } },
  })
  console.log(`Deleted ${deletedLogs.count} old audit logs`)

  // Eliminar notificaciones > 6 meses
  const sixMonthsAgo = subMonths(now, 6)
  const deletedNotifs = await prisma.notification.deleteMany({
    where: { createdAt: { lte: sixMonthsAgo }, status: 'sent' },
  })
  console.log(`Deleted ${deletedNotifs.count} old notifications`)

  console.log('Data retention completed')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
