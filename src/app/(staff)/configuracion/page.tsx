'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Shield, Key, Bell, Globe, Database, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function ConfigPage() {
  const { data: session } = useSession()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(session?.user?.twoFactorEnabled || false)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Configuración</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestiona tu cuenta y preferencias</p>
      </div>

      <div className="bg-white rounded-2xl border divide-y">
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Mi perfil</p>
              <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
            </div>
          </div>
          <button className="text-sm text-rose-500 hover:text-rose-600 font-medium">Editar</button>
        </div>

        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-xl">
              <Key size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Cambiar contraseña</p>
              <p className="text-xs text-muted-foreground">Actualiza tu contraseña periódicamente</p>
            </div>
          </div>
          <button className="text-sm text-rose-500 hover:text-rose-600 font-medium">Cambiar</button>
        </div>

        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-xl">
              <Shield size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Autenticación en dos pasos (2FA)</p>
              <p className="text-xs text-muted-foreground">
                {twoFactorEnabled
                  ? 'Tu cuenta está protegida con 2FA'
                  : 'Añade una capa extra de seguridad'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              twoFactorEnabled ? 'bg-rose-400' : 'bg-gray-300'
            }`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              twoFactorEnabled ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border divide-y">
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-xl">
              <Bell size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Preferencias de notificación</p>
              <p className="text-xs text-muted-foreground">Configura cómo quieres recibir avisos</p>
            </div>
          </div>
          <Badge>WhatsApp</Badge>
        </div>
      </div>

      <div className="bg-white rounded-2xl border divide-y">
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-xl">
              <Globe size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Google Calendar</p>
              <p className="text-xs text-muted-foreground">Sincroniza tus citas con Google Calendar</p>
            </div>
          </div>
          <button className="text-sm bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600 transition-colors">
            Conectar
          </button>
        </div>

        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-xl">
              <Database size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Exportar datos</p>
              <p className="text-xs text-muted-foreground">Descarga una copia de tus datos</p>
            </div>
          </div>
          <button className="text-sm text-rose-500 hover:text-rose-600 font-medium">Exportar</button>
        </div>
      </div>
    </div>
  )
}
