import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { startOfDay, endOfDay } from 'date-fns'
import { CalendarDays, Clock, Dog, Euro, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils/pricing'
import { formatTime } from '@/lib/utils/dates'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)

  const appointments = await prisma.appointment.findMany({
    where: {
      startDateTime: { gte: todayStart, lte: todayEnd },
      status: { notIn: ['cancelled'] },
    },
    include: {
      pet: { select: { name: true } },
      owner: { select: { name: true } },
      service: { select: { name: true } },
    },
    orderBy: { startDateTime: 'asc' },
  })

  const confirmed = appointments.filter(a => a.status === 'confirmed').length
  const inProgress = appointments.filter(a => a.status === 'in_progress').length
  const pending = appointments.filter(a => a.status === 'pending').length
  const completed = appointments.filter(a => a.status === 'completed').length

  const tickets = await prisma.ticket.findMany({
    where: {
      appointment: { completedAt: { gte: todayStart, lte: todayEnd } },
      paymentStatus: { notIn: ['refunded'] },
    },
  })

  const revenue = tickets.reduce((sum, t) => sum + Number(t.totalAmount), 0)

  const inProgressAppt = appointments.find(a => a.status === 'in_progress')

  return {
    appointments,
    stats: { total: appointments.length, confirmed, inProgress, pending, completed },
    revenue,
    inProgressPet: inProgressAppt
      ? `${inProgressAppt.pet.name} - ${inProgressAppt.service.name}`
      : null,
  }
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  in_progress: 'bg-purple-50 text-purple-700',
  completed: 'bg-green-50 text-green-700',
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  in_progress: 'En curso',
  completed: 'Completada',
}

const pipelineConfig = [
  { status: 'pending', label: 'Pendientes de llegar', desc: 'mascotas pendientes', bg: 'bg-amber-50', iconBg: 'bg-amber-200', icon: '⏳', textColor: 'text-amber-700' },
  { status: 'confirmed', label: 'Confirmadas', desc: 'citas confirmadas', bg: 'bg-blue-50', iconBg: 'bg-blue-200', icon: '✅', textColor: 'text-blue-700' },
  { status: 'in_progress', label: 'En curso', desc: null, bg: 'bg-purple-50', iconBg: 'bg-purple-200', icon: '🔧', textColor: 'text-purple-700' },
  { status: 'completed', label: 'Listas para recoger', desc: 'mascota lista', bg: 'bg-green-50', iconBg: 'bg-green-200', icon: '🏁', textColor: 'text-green-700' },
]

export default async function DashboardPage() {
  const session = await auth()
  const data = await getDashboardData()
  const userName = session?.user?.name?.split(' ')[0] || 'admin'

  const todayString = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const statsCards = [
    { label: 'Citas hoy', value: data.stats.total, icon: CalendarDays, color: 'bg-blue-50 text-blue-600' },
    { label: 'En curso', value: data.stats.inProgress, icon: Clock, color: 'bg-purple-50 text-purple-600' },
    { label: 'Pendientes recoger', value: data.stats.completed, icon: Dog, color: 'bg-amber-50 text-amber-600' },
    { label: 'Ingresos hoy', value: formatCurrency(data.revenue), icon: Euro, color: 'bg-green-50 text-green-600' },
  ]

  const pipelineCounts: Record<string, number> = {
    pending: data.stats.pending,
    confirmed: data.stats.confirmed,
    in_progress: data.stats.inProgress,
    completed: data.stats.completed,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Buenas, {userName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{todayString}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
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
            {data.appointments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No hay citas para hoy</p>
            )}
            {data.appointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-500 w-12">{formatTime(apt.startDateTime)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{apt.pet.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{apt.service.name} · {apt.owner.name}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[apt.status] || ''}`}>
                  {statusLabels[apt.status] || apt.status}
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
            {pipelineConfig.map((item) => {
              const count = pipelineCounts[item.status] || 0
              const desc = item.status === 'in_progress' && data.inProgressPet
                ? data.inProgressPet
                : `${count} ${item.desc || ''}`
              return (
                <div key={item.status} className={`flex items-center gap-3 p-3 ${item.bg} rounded-xl`}>
                  <div className={`w-8 h-8 ${item.iconBg} rounded-full flex items-center justify-center text-sm`}>{item.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <span className={`text-xs font-medium ${item.textColor}`}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
