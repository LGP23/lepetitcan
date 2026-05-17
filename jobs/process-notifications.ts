import { prisma } from '@/lib/db'
import { sendWhatsApp } from '@/lib/integrations/twilio'
import { sendEmail, buildEmailTemplate } from '@/lib/integrations/resend'

async function main() {
  const pending = await prisma.notification.findMany({
    where: { status: 'pending' },
    include: { owner: true },
    orderBy: { createdAt: 'asc' },
    take: 50,
  })

  for (const notif of pending) {
    try {
      switch (notif.channel) {
        case 'whatsapp': {
          if (notif.owner.phone) {
            await sendWhatsApp(notif.owner.phone, notif.body)
          }
          break
        }
        case 'email': {
          if (notif.owner.email) {
            await sendEmail({
              to: notif.owner.email,
              subject: notif.title || 'Le Petit Can',
              html: buildEmailTemplate(notif.title || '', notif.body),
            })
          }
          break
        }
        case 'sms': {
          if (notif.owner.phone) {
            const { sendSMS } = await import('@/lib/integrations/twilio')
            await sendSMS(notif.owner.phone, notif.body)
          }
          break
        }
      }

      await prisma.notification.update({
        where: { id: notif.id },
        data: { status: 'sent', sentAt: new Date() },
      })
    } catch (error) {
      console.error(`Failed to send notification ${notif.id}:`, error)
      await prisma.notification.update({
        where: { id: notif.id },
        data: { status: 'failed' },
      })
    }
  }

  console.log(`Processed ${pending.length} notifications`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
