'use client'

import { useSession } from 'next-auth/react'
import { Bell, Search } from 'lucide-react'
import { useState } from 'react'

export function TopBar() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar clientes, mascotas..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-rose-200 rounded-full flex items-center justify-center text-sm font-medium text-rose-700">
            {session?.user?.name?.charAt(0) || 'U'}
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">{session?.user?.name || 'Usuario'}</p>
            <p className="text-xs text-gray-500 capitalize">{session?.user?.role === 'admin' ? 'Administrador' : 'Peluquero'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
