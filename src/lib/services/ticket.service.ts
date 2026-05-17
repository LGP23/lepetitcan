import { prisma } from '@/lib/db'
import { PaymentMethod } from '@prisma/client'

const TICKET_PREFIX = 'T'
const TICKET_PADDING = 6

export async function generateTicketNumber(): Promise<string> {
  const last = await prisma.ticket.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { number: true },
  })
  let nextNum = 1
  if (last) {
    const lastNum = parseInt(last.number.replace(`${TICKET_PREFIX}-`, ''), 10)
    nextNum = lastNum + 1
  }
  return `${TICKET_PREFIX}-${nextNum.toString().padStart(TICKET_PADDING, '0')}`
}

export async function createTicketFromAppointment(appointmentId: string, paymentMethod: PaymentMethod) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { pet: true, service: true, owner: true },
  })
  if (!appointment) throw new Error('Cita no encontrada')
  if (!appointment.totalAmount) throw new Error('La cita no tiene importe calculado')

  const number = await generateTicketNumber()

  const [ticket] = await prisma.$transaction([
    prisma.ticket.create({
      data: { number, totalAmount: appointment.totalAmount, paymentMethod, paymentStatus: 'paid', appointmentId },
      include: { appointment: { include: { pet: true, owner: true, service: true } } },
    }),
    prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'completed', actualHours: appointment.actualHours },
    }),
  ])

  return ticket
}

const INVOICE_PREFIX = 'F'
const INVOICE_PADDING = 5
const IVA_RATE = 21

export async function generateInvoiceNumber(): Promise<string> {
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

export async function createInvoiceFromTicket(ticketId: string, companyName: string, cif: string, address?: string) {
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })
  if (!ticket) throw new Error('Ticket no encontrado')

  const number = await generateInvoiceNumber()
  const total = Number(ticket.totalAmount)
  const subtotal = parseFloat((total / (1 + IVA_RATE / 100)).toFixed(2))
  const ivaAmount = parseFloat((total - subtotal).toFixed(2))

  return prisma.invoice.create({
    data: { number, companyName, cif, address: address || null, subtotal, ivaRate: IVA_RATE, ivaAmount, total, ticketId },
    include: { ticket: { include: { appointment: { include: { owner: true, pet: true, service: true } } } } },
  })
}

export function generateInvoiceHTML(invoice: any): string {
  const { number, companyName, cif, address, subtotal, ivaRate, ivaAmount, total, createdAt } = invoice
  const ticket = invoice.ticket
  const apt = ticket?.appointment
  const owner = apt?.owner
  const pet = apt?.pet
  const service = apt?.service

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
.header { text-align: center; border-bottom: 2px solid #E8A0B4; padding-bottom: 20px; margin-bottom: 30px; }
.header h1 { font-family: Georgia, serif; color: #E8A0B4; margin: 0; font-size: 28px; }
.header p { color: #8B7355; margin: 5px 0 0; }
.invoice-title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
.invoice-meta { display: flex; justify-content: space-between; margin-bottom: 30px; }
.meta-block { width: 45%; }
.meta-block h3 { font-size: 14px; color: #666; margin-bottom: 5px; }
.meta-block p { margin: 2px 0; font-size: 13px; }
table { width: 100%; border-collapse: collapse; margin: 20px 0; }
th { background: #FFF8F3; text-align: left; padding: 10px; font-size: 13px; color: #666; }
td { padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; }
.total-row td { font-weight: bold; border-top: 2px solid #333; border-bottom: none; }
.total-final td { font-size: 18px; font-weight: bold; color: #E8A0B4; border: none; }
.footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center; }
.footer p { margin: 3px 0; }
</style></head><body>
<div class="header"><h1>Le Petit Can</h1><p>Salón Boutique de Estética Canina · Narón</p></div>
<div class="invoice-title">FACTURA ${number}</div>
<div class="invoice-meta">
  <div class="meta-block">
    <h3>Emisor</h3>
    <p>Le Petit Can</p>
    <p>Rúa Francisco Pizarro, 11</p>
    <p>15570 Narón, A Coruña</p>
    <p>${owner?.phone || ''}</p>
  </div>
  <div class="meta-block">
    <h3>Cliente</h3>
    <p>${companyName}</p>
    <p>${cif}</p>
    <p>${address || ''}</p>
  </div>
</div>
<div style="margin-bottom:20px;font-size:13px;color:#666;">
  Fecha: ${new Date(createdAt).toLocaleDateString('es-ES')}
  ${pet ? `| Mascota: ${pet.name} (${pet.breed || ''})` : ''}
  ${service ? `| Servicio: ${service.name}` : ''}
</div>
<table>
  <tr><th>Concepto</th><th>Cant.</th><th>Precio</th><th>Total</th></tr>
  <tr>
    <td>${service?.name || ticket?.appointment?.service?.name || 'Servicio'}</td>
    <td>1</td>
    <td>${subtotal.toFixed(2)}€</td>
    <td>${subtotal.toFixed(2)}€</td>
  </tr>
</table>
<table>
  <tr class="total-row"><td colspan="3" style="text-align:right;">Base imponible</td><td>${subtotal.toFixed(2)}€</td></tr>
  <tr><td colspan="3" style="text-align:right;">IVA ${ivaRate}%</td><td>${ivaAmount.toFixed(2)}€</td></tr>
  <tr class="total-final"><td colspan="3" style="text-align:right;">TOTAL</td><td>${total.toFixed(2)}€</td></tr>
</table>
<div class="footer">
  <p>Le Petit Can · Rúa Francisco Pizarro, 11 · 15570 Narón · A Coruña</p>
  <p>Tel: +34 698 13 07 77 · lepetitcan.naron@gmail.com</p>
  <p>© ${new Date().getFullYear()} Le Petit Can</p>
</div>
</body></html>`
}
