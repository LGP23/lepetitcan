'use client'

import { FileText, Search, Download, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const mockInvoices = [
  { id: '1', number: 'F-2026-0001', client: 'Ana García', date: '10/06/2026', base: '82.00€', iva: '17.22€', total: '99.22€' },
  { id: '2', number: 'F-2026-0002', client: 'Pedro López', date: '08/06/2026', base: '45.00€', iva: '9.45€', total: '54.45€' },
  { id: '3', number: 'F-2026-0003', client: 'María Ruiz', date: '05/06/2026', base: '100.00€', iva: '21.00€', total: '121.00€' },
]

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Facturación</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestiona tus facturas</p>
        </div>
        <button className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Nueva factura
        </button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Buscar factura..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" />
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-4 py-3 font-medium text-gray-500">Nº Factura</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Cliente</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Fecha</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Base</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">IVA</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Total</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{inv.number}</td>
                <td className="px-4 py-3">{inv.client}</td>
                <td className="px-4 py-3 text-muted-foreground">{inv.date}</td>
                <td className="px-4 py-3 text-right">{inv.base}</td>
                <td className="px-4 py-3 text-right">{inv.iva}</td>
                <td className="px-4 py-3 text-right font-medium">{inv.total}</td>
                <td className="px-4 py-3 text-right">
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                    <Download size={16} className="text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
