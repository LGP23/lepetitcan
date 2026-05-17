import { prisma } from '@/lib/db'

async function main() {
  const today = new Date()
  const todayMonthDay = { month: today.getMonth() + 1, day: today.getDate() }

  const pets = await prisma.pet.findMany({
    where: {
      isActive: true,
      birthDate: { not: null },
    },
    include: {
      owners: { include: { owner: true } },
      appointments: { take: 1, orderBy: { createdAt: 'desc' } },
    },
  })

  const birthdays = pets.filter((pet) => {
    if (!pet.birthDate) return false
    const bd = new Date(pet.birthDate)
    return bd.getMonth() + 1 === todayMonthDay.month && bd.getDate() === todayMonthDay.day
  })

  for (const pet of birthdays) {
    for (const po of pet.owners) {
      const existing = await prisma.notification.findFirst({
        where: { type: 'birthday', ownerId: po.ownerId, createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      })
      if (existing) continue

      await prisma.notification.create({
        data: {
          type: 'birthday',
          channel: po.owner.prefChannel,
          ownerId: po.ownerId,
          recipient: po.owner.phone || po.owner.email || '',
          title: '¡Feliz cumpleaños! 🎂',
          body: `¡Feliz cumpleaños ${pet.name}! 🐾🎉 Esperamos verte pronto en Le Petit Can.`,
          status: 'pending',
          metadata: { petName: pet.name, petId: pet.id },
        },
      })
    }
  }

  console.log(`Birthday reminders: ${birthdays.length} pets`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
