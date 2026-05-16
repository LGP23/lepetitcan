import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  const services = await prisma.serviceCatalog.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  return NextResponse.json({ data: services })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  try {
    const body = await request.json()
    const service = await prisma.serviceCatalog.create({ data: body })

    return NextResponse.json({ data: service }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: { message: 'Error al crear servicio' } },
      { status: 500 }
    )
  }
}
