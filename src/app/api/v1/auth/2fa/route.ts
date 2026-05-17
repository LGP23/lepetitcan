import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  const body = await request.json()
  const { action, code } = body

  if (action === 'setup') {
    const secret = authenticator.generateSecret()
    const uri = authenticator.keyuri(session.user.email!, 'Le Petit Can', secret)

    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorSecret: secret },
    })

    const qrCodeDataUrl = await QRCode.toDataURL(uri)

    return NextResponse.json({ secret, qrCode: qrCodeDataUrl, uri })
  }

  if (action === 'verify') {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user?.twoFactorSecret) {
      return NextResponse.json({ error: { message: '2FA no configurado' } }, { status: 400 })
    }

    const isValid = authenticator.check(code, user.twoFactorSecret)
    if (!isValid) {
      return NextResponse.json({ error: { message: 'Código inválido' } }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorEnabled: true },
    })

    return NextResponse.json({ success: true })
  }

  if (action === 'disable') {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user?.twoFactorEnabled) {
      return NextResponse.json({ error: { message: '2FA no está activo' } }, { status: 400 })
    }

    const isValid = authenticator.check(code, user.twoFactorSecret!)
    if (!isValid) {
      return NextResponse.json({ error: { message: 'Código inválido' } }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 })
}

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorEnabled: true },
  })

  return NextResponse.json({ twoFactorEnabled: user?.twoFactorEnabled || false })
}
