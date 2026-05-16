'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getWeekDays, formatDate } from '@/lib/utils/dates'

const hours = Array.from({ length: 8 }, (_, i) => i + 9)

const mockWeekAppointments: Record<string, { hour: number; pet: string; service: string; status: string }[]> = {
  '2026-06-15': [
    { hour: 10, pet: 'Luna', service: 'Corte', status: 'confirmed' },
    { hour: 12, pet: 'Thor', service: 'Baño', status: 'confirmed' },
  ],
  '2026-06-16': [
    { hour: 9, pet: 'Lucas', service: 'Corte', status: 'confirmed' },
    { hour: 11, pet: 'Kira', service: 'Baño', status: 'in_progress' },
    { hour: 13, pet: 'Max', service: 'Uñas', status: 'pending' },
  ],
  '2026-06-17': [
    { hour: 10, pet: 'Rocky', service: 'Desenredado', status: 'confirmed' },
  ],
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const weekDays = getWeekDays(currentDate)

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
          <button className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
            <Plus size={18} />
            Nueva cita
          </button>
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

        <div className="overflow-y-auto max-h-[600px]">
          <div className="grid grid-cols-7">
            {weekDays.map((day, dayIdx) => {
              const dateStr = day.toISOString().split('T')[0]
              const dayAppointments = mockWeekAppointments[dateStr] || []
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
                          <div className={`absolute inset-1 rounded-lg p-1.5 text-xs cursor-pointer transition-colors ${
                            apt.status === 'confirmed' ? 'bg-blue-50 border border-blue-200' :
                            apt.status === 'in_progress' ? 'bg-purple-50 border border-purple-200' :
                            'bg-amber-50 border border-amber-200'
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
