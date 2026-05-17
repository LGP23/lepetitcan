'use client'

import { FileText, Search, Printer, Dog, Scissors } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const mockAlbaranes = [
  { id: '1', number: 'A-2026-00001', client: 'Ana García', pet: 'Luna', service: 'Baño completo', date: '16/06/2026', total: '35.00€' },
  { id: '2', number: 'A-2026-00002', client: 'Pedro López', pet: 'Lucas', service: 'Corte de pelo', date: '16/06/2026', total: '45.00€' },
  { id: '3', number: 'A-2026-00003', client: 'María Ruiz', pet: 'Thor', service: 'Desenredado', date: '15/06/2026', total: '30.00€' },
]

export default function AlbaranesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Albaranes</h1>
          <p className="text-sm text-muted-foreground mt-1">Partes de trabajo y servicios realizados</p>
        </div>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Buscar albarán..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" />
      </div>

      <div className="space-y-3">
        {mockAlbaranes.map((alb) => (
          <div key={alb.id} className="bg-white rounded-2xl border p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-50 rounded-xl">
                  <FileText size={20} className="text-rose-500" />
                </div>
                <div>
                  <p className="font-medium">{alb.number}</p>
                  <p className="text-xs text-muted-foreground">{alb.date}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="flex items-center gap-1"><Dog size={14} className="text-gray-400" /> {alb.pet}</span>
                    <span className="flex items-center gap-1"><Scissors size={14} className="text-gray-400" /> {alb.service}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{alb.client}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-rose-600">{alb.total}</p>
                <button className="mt-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <Printer size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="p-1.5 bg-green-50 text-green-700 rounded-lg">✅ Llegó</span>
                <span className="p-1.5 bg-green-50 text-green-700 rounded-lg">🛁 Baño</span>
                <span className="p-1.5 bg-gray-100 text-gray-400 rounded-lg">✂️ Corte</span>
                <span className="p-1.5 bg-gray-100 text-gray-400 rounded-lg">💨 Secado</span>
                <span className="p-1.5 bg-gray-100 text-gray-400 rounded-lg">🏁 Listo</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
