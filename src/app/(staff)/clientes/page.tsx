'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Phone, Mail, Dog, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { getClientes } from '@/actions/clientes'

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClients() {
      setLoading(true)
      const data = await getClientes()
      setClients(data)
      setLoading(false)
    }
    fetchClients()
  }, [])

  const filteredClients = clients.filter((client) => {
    const q = search.toLowerCase()
    return (
      client.name.toLowerCase().includes(q) ||
      (client.email && client.email.toLowerCase().includes(q)) ||
      (client.phone && client.phone.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clientes</h1>
          <p className="text-sm text-muted-foreground">{clients.length} clientes registrados</p>
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
        {loading ? (
          <div className="text-center py-12 text-sm text-muted-foreground animate-pulse">
            Cargando clientes...
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No se encontraron clientes.
          </div>
        ) : (
          <div className="divide-y">
            {filteredClients.map((client) => (
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
                    {client.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={12} /> {client.email}
                      </span>
                    )}
                    {client.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} /> {client.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground" title="Mascotas">
                    <Dog size={14} /> {client.pets.length}
                  </span>
                  <Badge variant="default" className="bg-rose-50 text-rose-700 hover:bg-rose-100 border-0">
                    {client.source}
                  </Badge>
                  <MoreHorizontal size={16} className="text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
