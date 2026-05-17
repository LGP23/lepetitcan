import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const createPetSchema = z.object({
  name: z.string().min(1),
  breed: z.string().optional(),
  size: z.enum(['toy', 'pequeno', 'mediano', 'grande', 'gigante']),
  birthDate: z.string().optional(),
  notes: z.string().optional(),
  ownerIds: z.array(z.string()).min(1, 'Debe tener al menos un dueño'),
})

export async function GET(request: Request) {
  const session = await auth()
  if (!session || session.user.role === 'cliente') {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const ownerId = searchParams.get('ownerId')

  const where: any = {}
  if (query) {
    where.name = { contains: query, mode: 'insensitive' }
  }
  if (ownerId) {
    where.owners = { some: { ownerId } }
  }

  const pets = await prisma.pet.findMany({
    where,
    include: {
      owners: {
        include: { owner: true },
      },
      _count: { select: { appointments: true } },
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json({ data: pets })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || session.user.role === 'cliente') {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = createPetSchema.parse(body)

    const pet = await prisma.pet.create({
      data: {
        name: data.name,
        breed: data.breed || null,
        size: data.size,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        notes: data.notes || null,
        owners: {
          create: data.ownerIds.map((ownerId, idx) => ({
            ownerId,
            isPrimary: idx === 0,
          })),
        },
      },
      include: {
        owners: {
          include: { owner: true },
        },
      },
    })

    await prisma.auditLog.create({
      data: {
        action: 'pet.create',
        entityType: 'pet',
        entityId: pet.id,
        userId: session.user.id,
        details: JSON.stringify({ name: pet.name, size: pet.size }),
      },
    })

    return NextResponse.json({ data: pet }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: error.errors[0].message } },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: { message: 'Error al crear mascota' } },
      { status: 500 }
    )
  }
}
