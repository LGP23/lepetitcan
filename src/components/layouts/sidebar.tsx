'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  LayoutDashboard, Users, PawPrint, Scissors, Calendar, CalendarCheck,
  Receipt, FileText, Package, Bell, UsersRound, Settings, Shield,
  ChevronLeft, LogOut, Menu, RotateCcw, ClipboardList,
} from 'lucide-react'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/mascotas', label: 'Mascotas', icon: PawPrint },
  { href: '/servicios', label: 'Servicios', icon: Scissors },
  { href: '/calendario', label: 'Calendario', icon: Calendar },
  { href: '/citas', label: 'Citas', icon: CalendarCheck },
  { href: '/tickets', label: 'TPV / Tickets', icon: Receipt },
  { href: '/tickets/albaranes', label: 'Albaranes', icon: ClipboardList },
  { href: '/tickets/devoluciones', label: 'Devoluciones', icon: RotateCcw },
  { href: '/facturas', label: 'Facturas', icon: FileText },
  { href: '/productos', label: 'Productos', icon: Package },
  { href: '/notificaciones', label: 'Notificaciones', icon: Bell },
  { href: '/equipo', label: 'Equipo', icon: UsersRound },
  { href: '/configuracion', label: 'Configuración', icon: Settings },
  { href: '/auditoria', label: 'Auditoría', icon: Shield },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      'bg-white border-r border-gray-200 flex flex-col transition-all duration-300 h-screen sticky top-0',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <Link href="/dashboard" className="font-serif text-xl font-semibold text-rose-500">
            Le Petit Can
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon size={20} className={isActive ? 'text-rose-500' : 'text-gray-400'} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-2 border-t">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 w-full transition-colors"
        >
          <LogOut size={20} className="text-gray-400" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  )
}
