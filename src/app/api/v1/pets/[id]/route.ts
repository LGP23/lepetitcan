import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  const pet = await prisma.pet.findUnique({
    where: { id: params.id },
    include: {
      owners: {
        include: { owner: true },
      },
      appointments: {
        include: { service: true, staff: { select: { name: true } }, ticket: true },
        orderBy: { startDateTime: 'desc' },
        take: 20,
      },
    },
  })

  if (!pet) {
    return NextResponse.json({ error: { message: 'Mascota no encontrada' } }, { status: 404 })
  }

  return NextResponse.json({ data: pet })
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
    const pet = await prisma.pet.update({
      where: { id: params.id },
      data: {
        name: body.name,
        breed: body.breed || null,
        size: body.size,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        notes: body.notes || null,
      },
      include: { owners: { include: { owner: true } } },
    })

    return NextResponse.json({ data: pet })
  } catch {
    return NextResponse.json(
      { error: { message: 'Error al actualizar mascota' } },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session || session.user.role === 'cliente') {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  await prisma.pet.update({
    where: { id: params.id },
    data: { isActive: false },
  })

  return NextResponse.json({ success: true })
}
