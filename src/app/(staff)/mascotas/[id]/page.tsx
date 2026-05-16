'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Dog, Cake, Users, Scissors, Calendar, Camera, Edit3, Plus, Phone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const mockPet = {
  id: '1',
  name: 'Luna',
  breed: 'Golden Retriever',
  size: 'grande',
  birthDate: '12/03/2020',
  age: '6 años',
  photoUrl: null,
  notes: 'Piel sensible. Usar champú hipoalergénico. Se pone nerviosa con el secador.',
  owners: [
    { id: '1', name: 'Ana García', phone: '+34 698 13 07 77', isPrimary: true },
    { id: '3', name: 'Pedro García', phone: '+34 611 22 33 44', isPrimary: false },
  ],
  appointments: [
    { date: '10/06/2026', service: 'Baño completo', staff: 'Iliana', amount: '35.00€', status: 'completed' },
    { date: '25/05/2026', service: 'Corte de pelo', staff: 'Iliana', amount: '45.00€', status: 'completed' },
    { date: '12/05/2026', service: 'Corte de uñas', staff: 'Iliana', amount: '12.00€', status: 'completed' },
    { date: '28/04/2026', service: 'Corte de pelo', staff: 'Iliana', amount: '45.00€', status: 'completed' },
    { date: '15/04/2026', service: 'Baño completo', staff: 'Iliana', amount: '35.00€', status: 'completed' },
  ],
  totalVisits: 12,
  lastVisit: '10/06/2026',
}

const sizeLabels: Record<string, string> = {
  toy: 'Toy', pequeno: 'Pequeño', mediano: 'Mediano', grande: 'Grande', gigante: 'Gigante',
}

export default function PetDetailPage() {
  const params = useParams()
  const pet = mockPet

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/mascotas" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gray-900 mb-2">
        <ArrowLeft size={16} /> Volver a mascotas
      </Link>

      <div className="bg-white rounded-2xl border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0 relative">
              <Dog size={32} className="text-rose-500" />
              {!pet.photoUrl && (
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow border flex items-center justify-center hover:bg-gray-50">
                  <Camera size={12} className="text-gray-400" />
                </button>
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold">{pet.name}</h1>
              <p className="text-sm text-muted-foreground">{pet.breed}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="primary">{sizeLabels[pet.size]}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Cake size={12} /> {pet.birthDate} ({pet.age})
                </span>
                <span className="text-xs text-muted-foreground">Última visita: {pet.lastVisit}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit3 size={16} className="mr-1" /> Editar
            </Button>
            <Button size="sm">
              <Plus size={16} className="mr-1" /> Nueva cita
            </Button>
          </div>
        </div>

        {pet.notes && (
          <div className="mt-4 p-3 bg-amber-50 rounded-xl text-sm">
            <span className="font-medium">📋 Notas importantes: </span>{pet.notes}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-semibold">{pet.totalVisits}</p>
            <p className="text-xs text-muted-foreground">Visitas totales</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-semibold">{pet.owners.length}</p>
            <p className="text-xs text-muted-foreground">Dueños vinculados</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-semibold text-rose-600">172.00€</p>
            <p className="text-xs text-muted-foreground">Gasto total</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Users size={18} className="text-rose-500" /> Dueños vinculados
          </h2>
          <Button variant="outline" size="sm">
            <Plus size={16} className="mr-1" /> Vincular dueño
          </Button>
        </div>
        <div className="space-y-2">
          {pet.owners.map((owner) => (
            <Link key={owner.id} href={`/clientes/${owner.id}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-rose-50 transition-colors"
            >
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-xs font-medium text-rose-600">
                {owner.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {owner.name}
                  {owner.isPrimary && <Badge variant="primary" className="ml-2 text-[10px]">Principal</Badge>}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone size={12} /> {owner.phone}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <Calendar size={18} className="text-rose-500" /> Historial de servicios
          </h2>
          <span className="text-xs text-muted-foreground">{pet.appointments.length} visitas</span>
        </div>
        <div className="divide-y">
          {pet.appointments.map((apt, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gray-100 rounded-lg">
                  <Scissors size={14} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{apt.service}</p>
                  <p className="text-xs text-muted-foreground">{apt.date} · {apt.staff}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{apt.amount}</p>
                <Badge variant={apt.status === 'completed' ? 'success' : 'warning'}>
                  {apt.status === 'completed' ? 'Completada' : 'Pendiente'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-5">
        <h2 className="font-semibold mb-4">📸 Fotos</h2>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs">
              {i === 3 ? (
                <button className="flex flex-col items-center gap-1">
                  <Camera size={24} />
                  <span>Añadir foto</span>
                </button>
              ) : (
                '📷 Foto ' + i
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
