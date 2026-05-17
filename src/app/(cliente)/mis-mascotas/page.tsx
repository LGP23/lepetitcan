'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Dog, Plus, Cake, Syringe, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default function ClientPetsPage() {
  const { data: session } = useSession()
  const [pets] = useState([
    { id: '1', name: 'Luna', breed: 'Golden Retriever', size: 'Grande', birthDate: '12/03/2020', age: '6 años', lastVisit: '10/06/2026' },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Mis mascotas</h1>
        <Link href="/mis-mascotas/nueva" className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} /> Añadir mascota
        </Link>
      </div>

      {pets.map((pet) => (
        <div key={pet.id} className="bg-white rounded-2xl border p-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center">
              <Dog size={32} className="text-rose-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{pet.name}</h2>
              <p className="text-sm text-muted-foreground">{pet.breed}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="primary">{pet.size}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Cake size={12} /> {pet.birthDate} ({pet.age})</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href={`/citas/nueva?pet=${pet.id}`} className="text-center p-3 bg-rose-50 rounded-xl text-sm font-medium text-rose-700 hover:bg-rose-100 transition-colors">
              Reservar cita
            </Link>
            <Link href={`/historial?pet=${pet.id}`} className="text-center p-3 bg-gray-50 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
              Ver historial
            </Link>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Última visita: {pet.lastVisit}</span>
              <Link href={`/mis-mascotas/${pet.id}`} className="text-rose-500 hover:text-rose-600 font-medium">Editar →</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
