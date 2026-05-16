'use client'

import { Shield, User, Globe, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const mockLogs = [
  { id: '1', action: 'Cliente creado', user: 'Iliana Ortega', entity: 'owner', date: '16/06/2026 10:30', ip: '192.168.1.1' },
  { id: '2', action: 'Cita confirmada', user: 'Staff', entity: 'appointment', date: '16/06/2026 10:15', ip: '192.168.1.1' },
  { id: '3', action: 'Ticket generado', user: 'Iliana Ortega', entity: 'ticket', date: '16/06/2026 09:45', ip: '192.168.1.1' },
  { id: '4', action: 'Inicio sesión', user: 'Iliana Ortega', entity: 'session', date: '16/06/2026 09:00', ip: '192.168.1.1' },
  { id: '5', action: 'Factura generada', user: 'Staff', entity: 'invoice', date: '15/06/2026 14:20', ip: '192.168.1.1' },
]

export default function AuditPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Auditoría</h1>
        <p className="text-sm text-muted-foreground mt-1">Registro de actividad del sistema</p>
      </div>

      <div className="bg-white rounded-2xl border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-rose-500" />
            <span className="text-sm font-medium">Registro de actividad</span>
          </div>
          <Badge variant="info">{mockLogs.length} eventos hoy</Badge>
        </div>

        <div className="divide-y">
          {mockLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 py-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{log.action}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <User size={12} /> {log.user}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe size={12} /> {log.ip}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {log.date}
                  </span>
                </div>
              </div>
              <Badge variant="default" className="text-[10px]">{log.entity}</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-sm text-amber-800 font-medium">🔒 Seguridad nivel bancario</p>
        <p className="text-xs text-amber-600 mt-1">
          Todos los cambios en datos sensibles quedan registrados con usuario, IP y timestamp.
          Los logs se conservan durante 24 meses según normativa RGPD.
        </p>
      </div>
    </div>
  )
}
