import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const createClientSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  source: z.enum(['web', 'whatsapp', 'instagram', 'facebook', 'sms', 'phone', 'presencial', 'ai_agent']).default('presencial'),
  prefChannel: z.enum(['whatsapp', 'email', 'sms', 'instagram', 'facebook']).default('whatsapp'),
  notes: z.string().optional(),
})

export async function GET(request: Request) {
  const session = await auth()
  if (!session || session.user.role === 'cliente') {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where = query
    ? {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
        ],
      }
    : {}

  const [clients, total] = await Promise.all([
    prisma.owner.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        pets: {
          include: { pet: true },
        },
        _count: {
          select: { appointments: true },
        },
      },
    }),
    prisma.owner.count({ where }),
  ])

  return NextResponse.json({
    data: clients,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || session.user.role === 'cliente') {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = createClientSchema.parse(body)

    const client = await prisma.owner.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        source: data.source,
        prefChannel: data.prefChannel,
        notes: data.notes || null,
      },
      include: { pets: { include: { pet: true } } },
    })

    await prisma.auditLog.create({
      data: {
        action: 'client.create',
        entityType: 'owner',
        entityId: client.id,
        userId: session.user.id,
        details: { name: client.name },
      },
    })

    return NextResponse.json({ data: client }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: error.errors[0].message } },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: { message: 'Error al crear cliente' } },
      { status: 500 }
    )
  }
}
