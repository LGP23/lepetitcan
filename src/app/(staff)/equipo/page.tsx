'use client'

import { UsersRound, Plus, Shield, UserCog, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const mockTeam = [
  { id: '1', name: 'Iliana Ortega', email: 'iliana@lepetitcan.es', role: 'admin', lastLogin: 'Hoy 09:00', status: 'active' },
  { id: '2', name: 'Staff López', email: 'staff@lepetitcan.es', role: 'peluquero', lastLogin: 'Hoy 08:30', status: 'active' },
]

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Equipo</h1>
          <p className="text-sm text-muted-foreground mt-1">{mockTeam.length} miembros</p>
        </div>
        <button className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Invitar miembro
        </button>
      </div>

      <div className="bg-white rounded-2xl border divide-y">
        {mockTeam.map((member) => (
          <div key={member.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-rose-600">{member.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.email}</p>
            </div>
            <Badge variant={member.role === 'admin' ? 'primary' : 'info'}>
              {member.role === 'admin' ? 'Admin' : 'Peluquero'}
            </Badge>
            <span className="text-xs text-muted-foreground">{member.lastLogin}</span>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg">
              <MoreHorizontal size={16} className="text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
