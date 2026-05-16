'use client'

import { useState } from 'react'
import { Plus, Search, Phone, Mail, Dog, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

const mockClients = [
  { id: '1', name: 'Ana García', email: 'ana@email.com', phone: '+34 698 13 07 77', pets: 2, lastVisit: '10/06/2026', source: 'web' },
  { id: '2', name: 'Pedro López', email: 'pedro@email.com', phone: '+34 611 22 33 44', pets: 1, lastVisit: '08/06/2026', source: 'whatsapp' },
  { id: '3', name: 'María Ruiz', email: 'maria@email.com', phone: '+34 622 33 44 55', pets: 1, lastVisit: '05/06/2026', source: 'instagram' },
  { id: '4', name: 'Carlos Fernández', email: 'carlos@email.com', phone: '+34 633 44 55 66', pets: 2, lastVisit: '01/06/2026', source: 'presencial' },
]

export default function ClientsPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clientes</h1>
          <p className="text-sm text-muted-foreground">{mockClients.length} clientes registrados</p>
        </div>
        <Link
          href="/clientes/nuevo"
          className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Nuevo cliente
        </Link>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, email o teléfono..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="divide-y">
          {mockClients.map((client) => (
            <Link
              key={client.id}
              href={`/clientes/${client.id}`}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-rose-600">{client.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{client.name}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Mail size={12} /> {client.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={12} /> {client.phone}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Dog size={14} /> {client.pets}
                </span>
                <Badge variant={
                  client.source === 'web' ? 'info' :
                  client.source === 'whatsapp' ? 'success' :
                  client.source === 'instagram' ? 'purple' : 'default'
                }>
                  {client.source}
                </Badge>
                <span className="text-xs text-muted-foreground">{client.lastVisit}</span>
                <MoreHorizontal size={16} className="text-gray-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
