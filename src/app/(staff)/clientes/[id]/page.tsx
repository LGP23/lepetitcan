'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Phone, Mail, MapPin, Dog, Calendar, Scissors, FileText, Edit3, Plus } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const mockClient = {
  id: '1',
  name: 'Ana García',
  email: 'ana@email.com',
  phone: '+34 698 13 07 77',
  address: 'C/ Mayor 12, Narón',
  source: 'web',
  prefChannel: 'whatsapp',
  notes: 'Clienta habitual, prefiere WhatsApp',
  createdAt: '01/01/2025',
  pets: [
    { id: '1', name: 'Luna', breed: 'Golden Retriever', size: 'grande', birthDate: '12/03/2020', lastVisit: '10/06/2026' },
    { id: '2', name: 'Kira', breed: 'Shih Tzu', size: 'pequeno', birthDate: '05/08/2023', lastVisit: '05/06/2026' },
  ],
  appointments: [
    { date: '10/06/2026', pet: 'Luna', service: 'Baño completo', staff: 'Iliana', amount: '35.00€', status: 'completed' },
    { date: '05/06/2026', pet: 'Kira', service: 'Corte de pelo', staff: 'Iliana', amount: '35.00€', status: 'completed' },
    { date: '25/05/2026', pet: 'Luna', service: 'Corte de pelo', staff: 'Iliana', amount: '45.00€', status: 'completed' },
    { date: '12/05/2026', pet: 'Luna', service: 'Corte de uñas', staff: 'Iliana', amount: '12.00€', status: 'completed' },
  ],
  totalSpent: '127.00€',
  visits: 12,
  consent: { privacy: true, marketing: true },
}

export default function ClientDetailPage() {
  const params = useParams()
  const client = mockClient

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/clientes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gray-900 mb-2">
        <ArrowLeft size={16} /> Volver a clientes
      </Link>

      <div className="bg-white rounded-2xl border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center">
              <span className="text-xl font-semibold text-rose-600">{client.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">{client.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Mail size={14} /> {client.email}</span>
                <span className="flex items-center gap-1"><Phone size={14} /> {client.phone}</span>
                {client.address && <span className="flex items-center gap-1"><MapPin size={14} /> {client.address}</span>}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="info">{client.source}</Badge>
                <Badge variant="success">{client.prefChannel}</Badge>
                <span className="text-xs text-muted-foreground">Cliente desde {client.createdAt}</span>
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

        {client.notes && (
          <div className="mt-4 p-3 bg-amber-50 rounded-xl text-sm">
            <span className="font-medium">📝 Notas: </span>{client.notes}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-semibold">{client.visits}</p>
            <p className="text-xs text-muted-foreground">Visitas totales</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-semibold">{client.pets.length}</p>
            <p className="text-xs text-muted-foreground">Mascotas</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-semibold text-green-600">{client.totalSpent}</p>
            <p className="text-xs text-muted-foreground">Gasto total</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Dog size={18} className="text-rose-500" /> Mascotas
          </h2>
          <Button variant="outline" size="sm">
            <Plus size={16} className="mr-1" /> Vincular mascota
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {client.pets.map((pet) => (
            <Link key={pet.id} href={`/mascotas/${pet.id}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-rose-50 transition-colors"
            >
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                <Dog size={20} className="text-rose-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{pet.name}</p>
                <p className="text-xs text-muted-foreground">{pet.breed} · {pet.size}</p>
              </div>
              <span className="text-xs text-muted-foreground">{pet.lastVisit}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <Calendar size={18} className="text-rose-500" /> Historial de citas
          </h2>
          <Link href={`/clientes/${params.id}/history`} className="text-xs text-rose-500 hover:text-rose-600">
            Ver todo
          </Link>
        </div>
        <div className="divide-y">
          {client.appointments.map((apt, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gray-100 rounded-lg">
                  <Scissors size={14} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{apt.pet} · {apt.service}</p>
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
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <FileText size={18} className="text-rose-500" /> Facturas y tickets
        </h2>
        <div className="text-center py-6 text-sm text-muted-foreground">
          No hay facturas registradas. <Link href={`/clientes/${params.id}/facturas`} className="text-rose-500 hover:underline">Crear factura</Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-5">
        <h2 className="font-semibold mb-4">📋 Consentimientos</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
            <span className="text-sm">Política de privacidad</span>
            <Badge variant="success">Aceptado</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
            <span className="text-sm">Marketing</span>
            <Badge variant="success">Aceptado</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
