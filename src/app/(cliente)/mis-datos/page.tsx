'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { User, Mail, Phone, Shield, Key, Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function ClientProfilePage() {
  const { data: session } = useSession()
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Mi perfil</h1>

      <div className="bg-white rounded-2xl border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center">
            <span className="text-xl font-semibold text-rose-600">{session?.user?.name?.charAt(0) || 'U'}</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">{session?.user?.name}</h2>
            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-400" />
              <span className="text-sm">Nombre</span>
            </div>
            <span className="text-sm font-medium">{session?.user?.name}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-gray-400" />
              <span className="text-sm">Email</span>
            </div>
            <span className="text-sm font-medium">{session?.user?.email}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Key size={18} className="text-gray-400" />
              <span className="text-sm">Contraseña</span>
            </div>
            <button className="text-sm text-rose-500 hover:text-rose-600 font-medium">Cambiar</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-gray-400" />
              <div>
                <span className="text-sm">Autenticación en dos pasos (2FA)</span>
                <p className="text-xs text-muted-foreground">Protege tu cuenta con un código adicional</p>
              </div>
            </div>
            <button onClick={() => setTwoFactor(!twoFactor)}
              className={`relative w-10 h-5 rounded-full transition-colors ${twoFactor ? 'bg-rose-400' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${twoFactor ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-gray-400" />
              <div>
                <span className="text-sm">Notificaciones</span>
                <p className="text-xs text-muted-foreground">Canal preferido</p>
              </div>
            </div>
            <Badge>WhatsApp</Badge>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm">
        <p className="font-medium text-amber-800">🔒 Tus datos están seguros</p>
        <p className="text-xs text-amber-600 mt-1">Puedes solicitar la descarga o eliminación de tus datos en cualquier momento.</p>
      </div>
    </div>
  )
}
