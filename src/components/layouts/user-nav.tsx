'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { LogOut, User, Settings } from 'lucide-react'

export function UserNav() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm hover:bg-gray-50 rounded-xl px-3 py-1.5 transition-colors"
      >
        <div className="w-7 h-7 bg-rose-200 rounded-full flex items-center justify-center text-xs font-medium text-rose-700">
          {session?.user?.name?.charAt(0) || 'U'}
        </div>
        <span className="font-medium">{session?.user?.name || 'Usuario'}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border z-20 py-1">
            <Link
              href="/mis-datos"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
            >
              <User size={16} /> Mi perfil
            </Link>
            <Link
              href="/configuracion"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
            >
              <Settings size={16} /> Configuración
            </Link>
            <hr className="my-1" />
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 w-full text-left text-red-600"
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>
  )
}
