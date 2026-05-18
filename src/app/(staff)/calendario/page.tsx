'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getWeekDays, formatDate } from '@/lib/utils/dates'
import Link from 'next/link'
import { getWeekAppointments } from '@/actions/citas'

const hours = Array.from({ length: 8 }, (_, i) => i + 9)

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(false)
  const weekDays = getWeekDays(currentDate)

  useEffect(() => {
    async function loadAppointments() {
      setLoading(true)
      const startDate = weekDays[0]
      const endDate = weekDays[6]
      const data = await getWeekAppointments(startDate, endDate)
      setAppointments(data)
      setLoading(false)
    }
    loadAppointments()
  }, [currentDate])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Calendario</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {formatDate(weekDays[0], "d 'de' MMMM")} - {formatDate(weekDays[6], "d 'de' MMMM, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-sm font-medium hover:bg-gray-100 rounded-xl transition-colors"
          >
            Hoy
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronRight size={20} />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <Link href="/citas/nueva" className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
            <Plus size={18} />
            Nueva cita
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day, i) => (
            <div
              key={i}
              className={`px-3 py-3 text-center border-r last:border-r-0 ${
                day.toDateString() === new Date().toDateString() ? 'bg-rose-50' : ''
              }`}
            >
              <p className="text-xs text-muted-foreground uppercase">
                {day.toLocaleDateString('es-ES', { weekday: 'short' })}
              </p>
              <p className={`text-2xl font-semibold mt-1 ${
                day.toDateString() === new Date().toDateString() ? 'text-rose-500' : 'text-gray-900'
              }`}>
                {day.getDate()}
              </p>
            </div>
          ))}
        </div>

        <div className="overflow-y-auto max-h-[600px] relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
            </div>
          )}
          <div className="grid grid-cols-7">
            {weekDays.map((day, dayIdx) => {
              const year = day.getFullYear()
              const month = String(day.getMonth() + 1).padStart(2, '0')
              const dayStr = String(day.getDate()).padStart(2, '0')
              const dateStr = `${year}-${month}-${dayStr}`
              const dayAppointments = appointments[dateStr] || []
              return (
                <div key={dayIdx} className="border-r last:border-r-0 min-h-[500px]">
                  {hours.map((hour) => {
                    const apt = dayAppointments.find((a) => a.hour === hour)
                    return (
                      <div
                        key={hour}
                        className="h-14 border-b border-gray-50 px-2 py-1 relative hover:bg-gray-50/50 cursor-pointer transition-colors"
                      >
                        {apt && (
                          <div className={`absolute inset-1 rounded-lg p-1.5 text-xs cursor-pointer transition-colors shadow-sm border ${
                            apt.status === 'confirmed' ? 'bg-blue-50 border-blue-200' :
                            apt.status === 'in_progress' ? 'bg-purple-50 border-purple-200' :
                            apt.status === 'ready' ? 'bg-green-50 border-green-200' :
                            apt.status === 'completed' ? 'bg-gray-100 border-gray-200 opacity-50' :
                            'bg-amber-50 border-amber-200' // pending
                          }`}>
                            <p className="font-medium truncate">{apt.pet}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{apt.service}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  <div className="text-[10px] text-gray-300 text-center py-1 border-t">
                    {dayAppointments.length} citas
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
