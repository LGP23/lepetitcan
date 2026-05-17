import { prisma } from '@/lib/db'
import { NotificationType, NotificationChannel } from '@prisma/client'

export interface SendNotificationInput {
  type: NotificationType
  channel: NotificationChannel
  ownerId: string
  title?: string
  body: string
  metadata?: Record<string, any>
  ticketId?: string
}

function getTemplate(type: NotificationType, metadata?: Record<string, any>): { title: string; body: string } {
  switch (type) {
    case 'appointment_confirmation':
      return {
        title: 'Cita confirmada',
        body: `Tu cita para ${metadata?.petName} el ${metadata?.date} a las ${metadata?.time} está confirmada.`,
      }
    case 'appointment_reminder':
      return {
        title: 'Recordatorio de cita',
        body: `Te recordamos que ${metadata?.petName} tiene cita mañana a las ${metadata?.time}.`,
      }
    case 'appointment_cancellation':
      return {
        title: 'Cita cancelada',
        body: `Tu cita para ${metadata?.petName} del ${metadata?.date} ha sido cancelada.`,
      }
    case 'appointment_modification':
      return {
        title: 'Cita modificada',
        body: `Tu cita para ${metadata?.petName} ha sido reprogramada para el ${metadata?.newDate} a las ${metadata?.newTime}.`,
      }
    case 'pickup_reminder':
      return {
        title: '¡Mascota lista!',
        body: `${metadata?.petName} está listo para recoger. ¡Te esperamos en Le Petit Can! 🐾`,
      }
    case 'two_days_before':
      return {
        title: 'Faltan 2 días',
        body: `Faltan 2 días para la cita de ${metadata?.petName} (${metadata?.date} a las ${metadata?.time}).`,
      }
    case 'one_day_before':
      return {
        title: 'Falta 1 día',
        body: `Mañana es la cita de ${metadata?.petName} a las ${metadata?.time}. ¡Te esperamos!`,
      }
    case 'two_hours_before':
      return {
        title: '¡En 2 horas!',
        body: `${metadata?.petName} te espera en 2 horas. Recuerda traerlo limpio y en ayunas si es posible.`,
      }
    case 'six_weeks_followup':
      return {
        title: '¿Volvemos a vernos?',
        body: `Hace 6 semanas ${metadata?.petName} visitó Le Petit Can. ¿Quieres reservar su próxima cita? https://app.lepetitcan.es/citas/nueva`,
      }
    case 'birthday':
      return {
        title: '¡Feliz cumpleaños! 🎂',
        body: `¡Feliz cumpleaños ${metadata?.petName}! 🐾🎉 Esperamos verte pronto en Le Petit Can.`,
      }
    case 'review_request':
      return {
        title: '¿Cómo fue tu experiencia?',
        body: `Tu mascota ${metadata?.petName} ya está en casa. ¿Cómo valoras tu experiencia en Le Petit Can? ⭐`,
      }
    default:
      return { title: 'Le Petit Can', body: '' }
  }
}

export async function sendNotification(input: SendNotificationInput) {
  const { type, channel, ownerId, metadata } = input
  const template = getTemplate(type, metadata)

  const notification = await prisma.notification.create({
    data: {
      type,
      channel,
      ownerId,
      recipient: '',
      title: template.title,
      body: template.body,
      status: 'pending',
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  })

  // Here you'd integrate with:
  // - Twilio for WhatsApp/SMS
  // - Resend for Email
  // - Meta API for Instagram/Facebook
  // For now, we mark as sent (MVP placeholder)
  await prisma.notification.update({
    where: { id: notification.id },
    data: { status: 'sent', sentAt: new Date() },
  })

  return notification
}

export async function sendAppointmentNotifications(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { owner: true, pet: true, service: true },
  })

  if (!appointment) return

  const dateStr = appointment.startDateTime.toLocaleDateString('es-ES')
  const timeStr = appointment.startDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

  const metadata = {
    petName: appointment.pet.name,
    date: dateStr,
    time: timeStr,
    service: appointment.service.name,
  }

  const channel = appointment.owner.prefChannel

  await Promise.all([
    sendNotification({
      type: 'appointment_confirmation',
      channel,
      ownerId: appointment.ownerId,
      metadata,
    }),
  ])
}

export async function scheduleReminders(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { owner: true, pet: true },
  })

  if (!appointment || appointment.status === 'cancelled') return

  const metadata = {
    petName: appointment.pet.name,
    date: appointment.startDateTime.toLocaleDateString('es-ES'),
    time: appointment.startDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
  }

  const channel = appointment.owner.prefChannel

  const reminders = [
    { type: 'two_days_before' as NotificationType, delayDays: 2 },
    { type: 'one_day_before' as NotificationType, delayDays: 1 },
  ]

  for (const reminder of reminders) {
    const sendDate = new Date(appointment.startDateTime)
    sendDate.setDate(sendDate.getDate() - reminder.delayDays)

    if (sendDate > new Date()) {
      // In production, this would be a background job
      // For now, we just create the notification
      await prisma.notification.create({
        data: {
          type: reminder.type,
          channel,
          ownerId: appointment.ownerId,
          recipient: appointment.owner.phone || appointment.owner.email || '',
          title: reminder.type === 'two_days_before' ? 'Faltan 2 días' : 'Falta 1 día',
          body: reminder.type === 'two_days_before'
            ? `Faltan 2 días para la cita de ${metadata.petName}`
            : `Mañana es la cita de ${metadata.petName}`,
          status: 'pending',
          metadata,
        },
      })
    }
  }
}
