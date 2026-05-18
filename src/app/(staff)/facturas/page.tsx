'use client'

import { useState, useEffect } from 'react'
import { FileText, Search, Download, Plus, Receipt, Sparkles, Check, CreditCard, Banknote } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getTicketsAction } from '@/actions/facturacion'
import { formatCurrency } from '@/lib/utils/pricing'

export default function InvoicesPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const loadTickets = async () => {
    try {
      setLoading(true)
      const data = await getTicketsAction()
      setTickets(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  const filteredTickets = tickets.filter(t => 
    t.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.petName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getPaymentIcon = (method: string) => {
    if (method === 'cash') return <Banknote size={14} className="text-emerald-500 inline mr-1" />
    if (method === 'card') return <CreditCard size={14} className="text-blue-500 inline mr-1" />
    return <Receipt size={14} className="text-purple-500 inline mr-1" />
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles size={24} className="text-rose-400" />
            Historial de Ventas y Facturas
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">
            Registro total de tickets y boletas emitidos por finalización de servicios.
          </p>
        </div>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Buscar por Nº ticket, cliente o mascota..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-300 font-medium text-sm transition-all" 
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-12 bg-gray-150 animate-pulse rounded-xl"></div>
          <div className="h-12 bg-gray-150 animate-pulse rounded-xl"></div>
          <div className="h-12 bg-gray-150 animate-pulse rounded-xl"></div>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center text-gray-500 shadow-sm">
          <Receipt size={52} className="text-gray-200 mx-auto mb-3" />
          <p className="font-semibold text-sm">No se encontraron transacciones</p>
          <p className="text-xs text-gray-400 mt-1">¡Los tickets se generan automáticamente al marcar una cita como entregada y cobrada!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Nº Ticket</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Cliente / Mascota</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Fecha</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Pago</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Base Imponible</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">IVA (21%)</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Total Cobrado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTickets.map((inv) => (
                  <tr key={inv.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-rose-500">{inv.number}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-gray-900">{inv.clientName}</div>
                      <div className="text-[10px] text-gray-400 font-medium">Mascota: {inv.petName} · {inv.serviceName}</div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 font-medium">{inv.date}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-[10px] font-semibold">
                        {getPaymentIcon(inv.paymentMethod)}
                        {inv.paymentMethod === 'cash' ? 'EFECTIVO' : inv.paymentMethod === 'card' ? 'TARJETA' : 'BIZUM'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-gray-600">{formatCurrency(inv.base)}</td>
                    <td className="px-4 py-3.5 text-right font-medium text-gray-500">{formatCurrency(inv.iva)}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-gray-900 text-base">{formatCurrency(inv.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
