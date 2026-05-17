'use client'

import { Calendar, Scissors, Dog } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const mockHistory = [
  { id: '1', date: '10/06/2026', pet: 'Luna', service: 'Baño completo', staff: 'Iliana', amount: '35.00€', status: 'completed' },
  { id: '2', date: '25/05/2026', pet: 'Luna', service: 'Corte de pelo', staff: 'Iliana', amount: '45.00€', status: 'completed' },
  { id: '3', date: '12/05/2026', pet: 'Luna', service: 'Corte de uñas', staff: 'Iliana', amount: '12.00€', status: 'completed' },
  { id: '4', date: '05/05/2026', pet: 'Kira', service: 'Corte de pelo', staff: 'Iliana', amount: '35.00€', status: 'completed' },
]

export default function ClientHistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Historial de servicios</h1>

      <div className="bg-white rounded-2xl border divide-y">
        {mockHistory.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-xl">
                <Scissors size={18} className="text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  <Dog size={14} className="inline mr-1 text-rose-400" />
                  {item.pet} · {item.service}
                </p>
                <p className="text-xs text-muted-foreground">{item.date} · {item.staff}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{item.amount}</p>
              <Badge variant="success">Completada</Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground py-4">
        {mockHistory.length} servicios registrados
      </div>
    </div>
  )
}
