import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { generateInvoiceHTML } from '@/lib/services/ticket.service'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      ticket: {
        include: {
          appointment: {
            include: { owner: true, pet: true, service: true },
          },
        },
      },
    },
  })

  if (!invoice) {
    return NextResponse.json({ error: { message: 'Factura no encontrada' } }, { status: 404 })
  }

  const html = generateInvoiceHTML(invoice)

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `inline; filename="factura-${invoice.number}.html"`,
    },
  })
}
