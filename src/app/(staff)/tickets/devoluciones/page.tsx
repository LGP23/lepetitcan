'use client'

import { useState } from 'react'
import { Search, RotateCcw, Undo2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const mockRefunds = [
  { id: '1', ticket: 'T-000050', client: 'María Ruiz', amount: '25.00€', reason: 'Producto defectuoso', method: 'efectivo', date: '15/06/2026', status: 'completed' },
  { id: '2', ticket: 'T-000048', client: 'Pedro López', amount: '45.00€', reason: 'Cambio de opinión', method: 'tarjeta', date: '14/06/2026', status: 'completed' },
]

export default function RefundsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Devoluciones</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestiona devoluciones y reembolsos</p>
        </div>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Buscar devolución..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" />
      </div>

      <div className="bg-white rounded-2xl border divide-y">
        {mockRefunds.map((r) => (
          <div key={r.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
            <div className="p-2 bg-red-50 rounded-xl">
              <RotateCcw size={20} className="text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{r.ticket} · {r.client}</p>
              <p className="text-xs text-muted-foreground">{r.reason} · {r.date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-red-600">{r.amount}</p>
              <Badge variant={r.method === 'efectivo' ? 'warning' : 'info'}>{r.method}</Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border p-5">
        <h2 className="font-semibold mb-4">🔄 Nueva devolución</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Nº de ticket</label>
            <input type="text" placeholder="Ej: T-000055" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Importe</label>
              <input type="text" placeholder="0.00€" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Método reintegro</label>
              <select className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white">
                <option>Efectivo</option>
                <option>Tarjeta</option>
                <option>Bizum</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Motivo</label>
            <select className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white">
              <option>Producto defectuoso</option>
              <option>Cambio de opinión</option>
              <option>Error en el cobro</option>
              <option>Servicio no conforme</option>
              <option>Otro</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" /> Devolución parcial
          </label>
          <button className="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
            <Undo2 size={18} /> Procesar devolución
          </button>
        </div>
      </div>
    </div>
  )
}
