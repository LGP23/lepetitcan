import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session || session.user.role === 'cliente') {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  const client = await prisma.owner.findUnique({
    where: { id: params.id },
    include: {
      pets: {
        include: { pet: true },
      },
      appointments: {
        include: { pet: true, service: true, staff: { select: { name: true } } },
        orderBy: { startDateTime: 'desc' },
        take: 20,
      },
      productSales: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      notifications: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      consentRecords: true,
    },
  })

  if (!client) {
    return NextResponse.json({ error: { message: 'Cliente no encontrado' } }, { status: 404 })
  }

  return NextResponse.json({ data: client })
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session || session.user.role === 'cliente') {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  try {
    const body = await request.json()
    const client = await prisma.owner.update({
      where: { id: params.id },
      data: {
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        notes: body.notes || null,
        source: body.source,
        prefChannel: body.prefChannel,
        marketingConsent: body.marketingConsent,
      },
    })

    await prisma.auditLog.create({
      data: {
        action: 'client.update',
        entityType: 'owner',
        entityId: client.id,
        userId: session.user.id,
        details: { updates: Object.keys(body) },
      },
    })

    return NextResponse.json({ data: client })
  } catch {
    return NextResponse.json(
      { error: { message: 'Error al actualizar cliente' } },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  await prisma.owner.update({
    where: { id: params.id },
    data: { dataRetentionUntil: new Date() },
  })

  await prisma.auditLog.create({
    data: {
      action: 'client.delete',
      entityType: 'owner',
      entityId: params.id,
      userId: session.user.id,
    },
  })

  return NextResponse.json({ success: true })
}
