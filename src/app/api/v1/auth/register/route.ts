import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'Nombre demasiado corto'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  password: z.string().min(12, 'La contraseña debe tener al menos 12 caracteres'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json(
        { error: { message: 'Ya existe una cuenta con este email' } },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: 'cliente',
        owner: {
          create: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            source: 'web',
          },
        },
      },
      include: { owner: true },
    })

    await prisma.consentRecord.create({
      data: {
        type: 'privacy',
        version: '1.0',
        accepted: true,
        textShown: 'Política de Privacidad v1.0 - Aceptada en registro',
        ownerId: user.owner!.id,
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: error.errors[0].message } },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: { message: 'Error al registrar usuario' } },
      { status: 500 }
    )
  }
}
