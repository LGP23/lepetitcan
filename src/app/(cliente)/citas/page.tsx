'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Plus, Calendar, Clock, Dog } from 'lucide-react'

const mockAppointments = [
  { id: '1', pet: 'Luna', service: 'Corte de pelo', date: '2026-06-19', time: '10:00', status: 'confirmed' },
]

const mockHistory = [
  { id: '2', pet: 'Luna', service: 'Baño completo', date: '2026-06-10', amount: '35.00€', status: 'completed' },
  { id: '3', pet: 'Luna', service: 'Corte de pelo', date: '2026-05-25', amount: '45.00€', status: 'completed' },
]

export default function ClientAppointmentsPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Mis citas</h1>
          <p className="text-sm text-muted-foreground">
            Hola, {session?.user?.name || 'cliente'}
          </p>
        </div>
        <Link
          href="/citas/nueva"
          className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Nueva cita
        </Link>
      </div>

      {mockAppointments.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Próximas citas</h2>
          <div className="space-y-3">
            {mockAppointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-2xl border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-rose-50 rounded-xl">
                      <Dog size={22} className="text-rose-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{apt.pet} · {apt.service}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> {apt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {apt.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                    Confirmada
                  </span>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    Reprogramar
                  </button>
                  <button className="text-sm text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50">
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Historial</h2>
        <div className="bg-white rounded-2xl border divide-y">
          {mockHistory.map((apt) => (
            <div key={apt.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{apt.pet} · {apt.service}</p>
                <p className="text-xs text-muted-foreground">{apt.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{apt.amount}</p>
                <span className="text-xs text-green-600">Completada</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
