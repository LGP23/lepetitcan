'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, User, Phone, Mail } from 'lucide-react'

interface Owner {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  pets?: { pet: { id: string; name: string } }[]
}

interface ClientSearchProps {
  onSelect: (client: Owner) => void
  placeholder?: string
}

export function ClientSearch({ onSelect, placeholder = 'Buscar cliente...' }: ClientSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Owner[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/v1/clients?q=${encodeURIComponent(query)}&limit=10`)
        const json = await res.json()
        setResults(json.data || [])
        setOpen(true)
      } catch {
        setResults([])
      }
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-xl shadow-lg border z-50 max-h-60 overflow-y-auto">
          {results.map((client) => (
            <button
              key={client.id}
              onClick={() => {
                onSelect(client)
                setQuery(client.name)
                setOpen(false)
              }}
              className="w-full text-left px-4 py-3 hover:bg-rose-50 flex items-start gap-3 border-b border-gray-50 last:border-0 transition-colors"
            >
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-rose-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{client.name}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  {client.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={12} /> {client.phone}
                    </span>
                  )}
                  {client.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={12} /> {client.email}
                    </span>
                  )}
                </div>
                {client.pets && client.pets.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {client.pets.length} mascota{client.pets.length !== 1 ? 's' : ''}:{' '}
                    {client.pets.map((p) => p.pet.name).join(', ')}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
