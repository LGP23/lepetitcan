'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NewInvoicePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    ticketId: '', companyName: '', cif: '', address: '', ticketInfo: null as any,
  })
  const [saving, setSaving] = useState(false)

  async function searchTicket() {
    const res = await fetch(`/api/v1/tickets?search=${form.ticketId}`)
    const data = await res.json()
    if (data.data?.length > 0) {
      setForm({ ...form, ticketInfo: data.data[0] })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/v1/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const json = await res.json()
        router.push(`/facturas/${json.data.id}`)
      }
    } catch {
      alert('Error al generar factura')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/facturas" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gray-900">
        <ArrowLeft size={16} /> Volver a facturas
      </Link>

      <h1 className="text-2xl font-semibold">Nueva factura</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Nº de ticket</label>
          <div className="flex gap-2">
            <input type="text" value={form.ticketId} onChange={(e) => setForm({ ...form, ticketId: e.target.value })}
              placeholder="Ej: T-000001"
              className="flex-1 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" />
            <Button type="button" variant="outline" onClick={searchTicket}>Buscar</Button>
          </div>
        </div>

        {form.ticketInfo && (
          <div className="p-3 bg-green-50 rounded-xl text-sm">
            <p className="font-medium">Ticket: {form.ticketInfo.number}</p>
            <p className="text-muted-foreground">Importe: {form.ticketInfo.totalAmount}€</p>
          </div>
        )}

        <div className="border-t pt-4 space-y-4">
          <h3 className="font-medium text-sm">Datos fiscales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Nombre o razón social *</label>
              <input type="text" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CIF / NIF *</label>
              <input type="text" value={form.cif} onChange={(e) => setForm({ ...form, cif: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dirección fiscal</label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
          <p className="font-medium">Resumen</p>
          <p className="text-muted-foreground">Base imponible: <strong>—</strong></p>
          <p className="text-muted-foreground">IVA 21%: <strong>—</strong></p>
          <p className="text-muted-foreground">Total: <strong>—</strong></p>
          <p className="text-xs text-amber-600 mt-2">Los importes se calcularán automáticamente al crear la factura</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link href="/facturas"><Button type="button" variant="outline">Cancelar</Button></Link>
          <Button type="submit" disabled={saving || !form.companyName || !form.cif || !form.ticketId}>
            <FileText size={18} className="mr-1" />
            {saving ? 'Generando...' : 'Generar factura'}
          </Button>
        </div>
      </form>
    </div>
  )
}
