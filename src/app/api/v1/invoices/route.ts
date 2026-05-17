import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const INVOICE_PREFIX = 'F'
const INVOICE_PADDING = 5

async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const last = await prisma.invoice.findFirst({
    where: { number: { startsWith: `${INVOICE_PREFIX}-${year}-` } },
    orderBy: { createdAt: 'desc' },
    select: { number: true },
  })

  let nextNum = 1
  if (last) {
    const lastNum = parseInt(last.number.split('-')[2], 10)
    nextNum = lastNum + 1
  }

  return `${INVOICE_PREFIX}-${year}-${nextNum.toString().padStart(INVOICE_PADDING, '0')}`
}

const IVA_RATE = 21

const createInvoiceSchema = z.object({
  ticketId: z.string(),
  companyName: z.string().min(1),
  cif: z.string().min(1),
  address: z.string().optional(),
})

export async function GET(request: Request) {
  const session = await auth()
  if (!session || session.user.role === 'cliente') {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        ticket: {
          include: {
            appointment: {
              include: {
                owner: { select: { name: true } },
                pet: { select: { name: true } },
              },
            },
          },
        },
      },
    }),
    prisma.invoice.count(),
  ])

  return NextResponse.json({
    data: invoices,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || session.user.role === 'cliente') {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = createInvoiceSchema.parse(body)

    const ticket = await prisma.ticket.findUnique({
      where: { id: data.ticketId },
      include: { invoice: true },
    })

    if (!ticket) {
      return NextResponse.json({ error: { message: 'Ticket no encontrado' } }, { status: 404 })
    }
    if (ticket.invoice) {
      return NextResponse.json({ error: { message: 'El ticket ya tiene una factura' } }, { status: 409 })
    }

    const number = await generateInvoiceNumber()
    const total = Number(ticket.totalAmount)
    const subtotal = parseFloat((total / (1 + IVA_RATE / 100)).toFixed(2))
    const ivaAmount = parseFloat((total - subtotal).toFixed(2))

    const invoice = await prisma.invoice.create({
      data: {
        number,
        companyName: data.companyName,
        cif: data.cif,
        address: data.address || null,
        subtotal,
        ivaRate: IVA_RATE,
        ivaAmount,
        total,
        ticketId: data.ticketId,
      },
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

    return NextResponse.json({ data: invoice }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: { message: error.errors[0].message } }, { status: 400 })
    }
    return NextResponse.json({ error: { message: 'Error al crear factura' } }, { status: 500 })
  }
}
