'use client'

import { useSession } from 'next-auth/react'
import { CalendarDays, Clock, Dog, Euro, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { label: 'Citas hoy', value: '4', icon: CalendarDays, color: 'bg-blue-50 text-blue-600' },
  { label: 'En curso', value: '2', icon: Clock, color: 'bg-purple-50 text-purple-600' },
  { label: 'Pendientes recoger', value: '1', icon: Dog, color: 'bg-amber-50 text-amber-600' },
  { label: 'Ingresos hoy', value: '145€', icon: Euro, color: 'bg-green-50 text-green-600' },
]

const todayAppointments = [
  { time: '09:30', pet: 'Lucas', service: 'Corte de pelo', owner: 'Pedro López', status: 'confirmed' },
  { time: '10:45', pet: 'Luna', service: 'Baño completo', owner: 'Ana García', status: 'in_progress' },
  { time: '12:00', pet: 'Thor', service: 'Desenredado', owner: 'María Ruiz', status: 'confirmed' },
  { time: '13:30', pet: 'Kira', service: 'Corte + Uñas', owner: 'Ana García', status: 'pending' },
]

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Buenas, {session?.user?.name?.split(' ')[0] || 'admin'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-2xl border p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Citas de hoy</h2>
            <Link href="/calendario" className="text-sm text-rose-500 hover:text-rose-600 flex items-center gap-1">
              Ver calendario <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <div
                key={apt.time}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-500 w-12">{apt.time}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{apt.pet}</p>
                  <p className="text-xs text-muted-foreground truncate">{apt.service} · {apt.owner}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  apt.status === 'confirmed' ? 'bg-blue-50 text-blue-700' :
                  apt.status === 'in_progress' ? 'bg-purple-50 text-purple-700' :
                  'bg-amber-50 text-amber-700'
                }`}>
                  {apt.status === 'confirmed' ? 'Confirmada' :
                   apt.status === 'in_progress' ? 'En curso' : 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pipeline del día</h2>
            <Link href="/citas" className="text-sm text-rose-500 hover:text-rose-600 flex items-center gap-1">
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
              <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center text-sm">⏳</div>
              <div className="flex-1">
                <p className="text-sm font-medium">Pendientes de llegar</p>
                <p className="text-xs text-muted-foreground">2 mascotas</p>
              </div>
              <span className="text-xs font-medium text-amber-700">2</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-sm">✅</div>
              <div className="flex-1">
                <p className="text-sm font-medium">Confirmadas</p>
                <p className="text-xs text-muted-foreground">3 citas confirmadas</p>
              </div>
              <span className="text-xs font-medium text-blue-700">3</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
              <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-sm">🔧</div>
              <div className="flex-1">
                <p className="text-sm font-medium">En curso</p>
                <p className="text-xs text-muted-foreground">Luna - Baño</p>
              </div>
              <span className="text-xs font-medium text-purple-700">1</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-sm">🏁</div>
              <div className="flex-1">
                <p className="text-sm font-medium">Listas para recoger</p>
                <p className="text-xs text-muted-foreground">1 mascota lista</p>
              </div>
              <span className="text-xs font-medium text-green-700">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
