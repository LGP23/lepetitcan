'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function getPipelineAppointments() {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const appointments = await prisma.appointment.findMany({
    where: {
      startDateTime: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
    include: {
      owner: true,
      pet: true,
      service: true,
    },
    orderBy: {
      startDateTime: 'asc',
    },
  })

  // Group by status
  const pipeline = {
    pending: [] as any[],
    confirmed: [] as any[],
    in_progress: [] as any[],
    ready: [] as any[],
    completed: [] as any[],
  }

  appointments.forEach(app => {
    const formatted = {
      id: app.id,
      pet: app.pet.name,
      petId: app.pet.id,
      service: app.service.name,
      time: app.startDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      owner: app.owner.name,
      ownerId: app.owner.id,
      phone: app.owner.phone,
      status: app.status
    }

    if (app.status === 'pending') pipeline.pending.push(formatted)
    if (app.status === 'confirmed') pipeline.confirmed.push(formatted)
    if (app.status === 'in_progress') {
      const elapsed = Math.floor((new Date().getTime() - app.startDateTime.getTime()) / 60000)
      pipeline.in_progress.push({
        ...formatted,
        step: 'En progreso',
        elapsed: `${elapsed} min`
      })
    }
    if (app.status === 'ready') pipeline.ready.push(formatted)
    if (app.status === 'completed') {
      pipeline.completed.push({
        ...formatted,
        pickedUp: app.completedAt ? app.completedAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : formatted.time
      })
    }
  })

  return pipeline
}

export async function updateAppointmentStatus(id: string, status: string) {
  const data: any = { status }
  if (status === 'completed') {
    data.completedAt = new Date()
  }

  await prisma.appointment.update({
    where: { id },
    data,
  })
}

export async function getAppointmentById(id: string) {
  return prisma.appointment.findUnique({
    where: { id },
    include: {
      owner: true,
      pet: true,
      service: true,
      staff: true,
    }
  })
}

export async function saveAppointmentCheckout(id: string, data: {
  actualHours?: number
  totalAmount: number
  notes?: string
  status: string
  paymentMethod?: string
}) {
  const currentApp = await prisma.appointment.findUnique({ where: { id } })
  if (!currentApp) throw new Error('Appointment not found')

  const combinedNotes = data.notes 
    ? (currentApp.notes ? `${currentApp.notes}\n\n[Checkout]: ${data.notes}` : `[Checkout]: ${data.notes}`)
    : currentApp.notes

  const updatedApp = await prisma.appointment.update({
    where: { id },
    data: {
      status: data.status,
      completedAt: data.status === 'completed' ? new Date() : currentApp.completedAt,
      actualHours: data.actualHours,
      totalAmount: data.totalAmount,
      notes: combinedNotes
    }
  })

  if (data.status === 'completed') {
    const ticketNumber = `TK-${Math.floor(100000 + Math.random() * 900000)}`
    await prisma.ticket.upsert({
      where: { appointmentId: id },
      update: {
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod || 'card',
        paymentStatus: 'paid'
      },
      create: {
        appointmentId: id,
        number: ticketNumber,
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod || 'card',
        paymentStatus: 'paid'
      }
    })
  }

  return updatedApp
}

export async function getServices() {
  return prisma.serviceCatalog.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function createAppointment(data: any) {
  // Combine date and time
  const startDateTime = new Date(`${data.date}T${data.time}`)
  const endDateTime = new Date(startDateTime.getTime() + data.duration * 60000)

  // Calculate base price or hourly tracking
  const service = await prisma.serviceCatalog.findUnique({ where: { id: data.serviceId } })
  const pet = await prisma.pet.findUnique({ where: { id: data.petId } })
  
  if (!service || !pet) throw new Error('Service or Pet not found')

  const isHourly = pet.size === 'grande' || pet.size === 'gigante' ? service.priceTypeGrande === 'por_hora' : false

  return prisma.appointment.create({
    data: {
      status: 'pending',
      startDateTime,
      endDateTime,
      priceType: isHourly ? 'hourly' : 'fixed',
      estimatedHours: data.estimatedHours || 1,
      notes: data.notes,
      source: data.source || 'presencial',
      ownerId: data.ownerId,
      petId: data.petId,
      serviceId: data.serviceId,
      staffId: data.staffId,
    }
  })
}

export async function getWeekAppointments(startDate: Date, endDate: Date) {
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  const appointments = await prisma.appointment.findMany({
    where: {
      startDateTime: {
        gte: start,
        lte: end,
      },
    },
    include: { pet: true, service: true }
  })

  // Format into a Map or Record by date
  const result: Record<string, any[]> = {}
  appointments.forEach(app => {
    // get YYYY-MM-DD local time string
    // To handle timezone differences safely, we use YYYY-MM-DD format from the startDateTime itself.
    const year = app.startDateTime.getFullYear()
    const month = String(app.startDateTime.getMonth() + 1).padStart(2, '0')
    const day = String(app.startDateTime.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    if (!result[dateStr]) result[dateStr] = []
    
    result[dateStr].push({
      id: app.id,
      hour: app.startDateTime.getHours(),
      pet: app.pet.name,
      service: app.service.name,
      status: app.status
    })
  })

  return result
}

export async function completeAppointment(id: string, totalAmount: number, notes?: string) {
  const currentApp = await prisma.appointment.findUnique({ where: { id } })
  if (!currentApp) throw new Error('Appointment not found')

  const combinedNotes = notes 
    ? (currentApp.notes ? `${currentApp.notes}\n\n[Suplementos/Cierre]: ${notes}` : `[Suplementos/Cierre]: ${notes}`)
    : currentApp.notes

  await prisma.appointment.update({
    where: { id },
    data: {
      status: 'completed',
      completedAt: new Date(),
      totalAmount,
      notes: combinedNotes
    }
  })
}

export async function getClientAppointmentsAction() {
  const session = await auth()
  if (!session || !session.user) {
    throw new Error('Not authenticated')
  }

  // Get the user's ownerId
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { ownerId: true }
  })

  if (!user || !user.ownerId) {
    return { upcoming: [], history: [] }
  }

  const appointments = await prisma.appointment.findMany({
    where: { ownerId: user.ownerId },
    include: {
      pet: true,
      service: true,
    },
    orderBy: { startDateTime: 'desc' }
  })

  const upcoming = appointments
    .filter(app => ['pending', 'confirmed', 'in_progress', 'ready'].includes(app.status))
    .map(app => ({
      id: app.id,
      pet: app.pet.name,
      service: app.service.name,
      date: app.startDateTime.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      time: app.startDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      status: app.status
    }))

  const history = appointments
    .filter(app => app.status === 'completed')
    .map(app => ({
      id: app.id,
      pet: app.pet.name,
      service: app.service.name,
      date: app.startDateTime.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      amount: app.totalAmount ? `${app.totalAmount.toFixed(2)}€` : 'N/A',
      status: app.status
    }))

  return { upcoming, history }
}
