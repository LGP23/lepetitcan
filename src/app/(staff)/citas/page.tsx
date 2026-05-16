'use client'

import { useState } from 'react'
import { Plus, Dog, Phone, Clock, Send, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const pipelineColumns = [
  { id: 'pending', label: 'Pendientes', color: 'bg-amber-50 border-amber-200', textColor: 'text-amber-700' },
  { id: 'confirmed', label: 'Confirmadas', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
  { id: 'in_progress', label: 'En curso', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700' },
  { id: 'ready', label: 'Listas recoger', color: 'bg-green-50 border-green-200', textColor: 'text-green-700' },
  { id: 'completed', label: 'Recogidas', color: 'bg-gray-50 border-gray-200', textColor: 'text-gray-500' },
]

const mockPipeline = {
  pending: [
    { id: '1', pet: 'Kira', service: 'Corte + Uñas', time: '13:30', owner: 'Ana García', phone: '+34 698 13 07 77' },
  ],
  confirmed: [
    { id: '2', pet: 'Lucas', service: 'Corte', time: '09:30', owner: 'Pedro López', phone: '+34 611 22 33 44' },
    { id: '3', pet: 'Thor', service: 'Desenredado', time: '12:00', owner: 'María Ruiz', phone: '+34 622 33 44 55' },
  ],
  in_progress: [
    { id: '4', pet: 'Luna', service: 'Baño completo', time: '10:45', owner: 'Ana García', phone: '+34 698 13 07 77', step: 'Cortando', elapsed: '20 min' },
  ],
  ready: [
    { id: '5', pet: 'Rocky', service: 'Corte', time: '11:30', owner: 'Carlos Ruiz', phone: '+34 633 44 55 66' },
  ],
  completed: [
    { id: '6', pet: 'Max', service: 'Uñas', time: '12:00', owner: 'Pedro López', phone: '+34 611 22 33 44', pickedUp: '12:45' },
  ],
}

export default function PipelinePage() {
  const [columns] = useState(pipelineColumns)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pipeline del día</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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

      <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-200px)]">
        {columns.map((col) => {
          const items = mockPipeline[col.id as keyof typeof mockPipeline] || []
          return (
            <div key={col.id} className="flex flex-col min-w-[220px]">
              <div className={`flex items-center justify-between px-3 py-2 rounded-t-xl border ${col.color}`}>
                <span className={`text-sm font-medium ${col.textColor}`}>{col.label}</span>
                <Badge variant="default">{items.length}</Badge>
              </div>

              <div className={`flex-1 border-x border-b rounded-b-xl p-2 space-y-2 bg-gray-50/50 ${col.id === 'in_progress' ? 'min-h-[400px]' : ''}`}>
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl border p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Dog size={16} className="text-rose-500" />
                        <span className="font-medium text-sm">{item.pet}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1">{item.service}</p>
                    <p className="text-xs text-muted-foreground">{item.owner}</p>

                    {'step' in item && (
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <Clock size={12} className="text-purple-500" />
                        <span className="text-purple-600 font-medium">{(item as any).step} · {(item as any).elapsed}</span>
                      </div>
                    )}

                    {'pickedUp' in item && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle2 size={12} />
                        <span>Recogida {(item as any).pickedUp}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-50">
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors" title="Llamar">
                        <Phone size={14} className="text-gray-400" />
                      </button>
                      {col.id === 'ready' && (
                        <button className="p-1 hover:bg-green-100 rounded-lg transition-colors" title="Avisar recogida">
                          <Send size={14} className="text-green-500" />
                        </button>
                      )}
                      {col.id === 'in_progress' && (
                        <button className="ml-auto text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-100 transition-colors">
                          Completar
                        </button>
                      )}
                      {col.id === 'confirmed' && (
                        <button className="ml-auto text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors">
                          Check-in
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    Sin citas
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
