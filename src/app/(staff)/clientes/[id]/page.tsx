import { ArrowLeft, Phone, Mail, MapPin, Dog, Calendar, Scissors, FileText, Edit3, Plus } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getClienteById } from '@/actions/clientes'
import { formatCurrency } from '@/lib/utils/pricing'

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = await getClienteById(params.id)

  if (!client) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold mb-2">Cliente no encontrado</h1>
        <Link href="/clientes" className="text-rose-500 hover:underline">Volver a clientes</Link>
      </div>
    )
  }

  const totalSpent = client.appointments.reduce((acc, apt) => acc + (apt.totalAmount || 0), 0)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/clientes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gray-900 mb-2">
        <ArrowLeft size={16} /> Volver a clientes
      </Link>

      <div className="bg-white rounded-2xl border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-semibold text-rose-600">{client.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">{client.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                {client.email && <span className="flex items-center gap-1"><Mail size={14} /> {client.email}</span>}
                {client.phone && <span className="flex items-center gap-1"><Phone size={14} /> {client.phone}</span>}
                {client.address && <span className="flex items-center gap-1"><MapPin size={14} /> {client.address}</span>}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0">{client.source}</Badge>
                <Badge variant="default" className="bg-green-50 text-green-700 hover:bg-green-100 border-0">{client.prefChannel}</Badge>
                <span className="text-xs text-muted-foreground">Cliente desde {client.createdAt.toLocaleDateString('es-ES')}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit3 size={16} className="mr-1" /> Editar
            </Button>
            <Link href={`/citas/nueva?ownerId=${client.id}`}>
              <Button size="sm">
                <Plus size={16} className="mr-1" /> Nueva cita
              </Button>
            </Link>
          </div>
        </div>

        {client.notes && (
          <div className="mt-4 p-3 bg-amber-50 rounded-xl text-sm">
            <span className="font-medium">📝 Notas: </span>{client.notes}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-semibold">{client.appointments.length}</p>
            <p className="text-xs text-muted-foreground">Visitas totales</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-semibold">{client.pets.length}</p>
            <p className="text-xs text-muted-foreground">Mascotas</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-semibold text-green-600">{formatCurrency(totalSpent)}</p>
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
          {client.pets.map((ownerPetLink) => (
            <Link key={ownerPetLink.pet.id} href={`/mascotas/${ownerPetLink.pet.id}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-rose-50 transition-colors"
            >
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                <Dog size={20} className="text-rose-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{ownerPetLink.pet.name}</p>
                <p className="text-xs text-muted-foreground">{ownerPetLink.pet.breed || 'Sin raza'} · {ownerPetLink.pet.size}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <Calendar size={18} className="text-rose-500" /> Historial de citas
          </h2>
        </div>
        <div className="divide-y">
          {client.appointments.length === 0 ? (
            <div className="p-5 text-center text-sm text-muted-foreground">
              Sin historial de citas
            </div>
          ) : client.appointments.map((apt) => (
            <div key={apt.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gray-100 rounded-lg">
                  <Scissors size={14} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{apt.pet.name} · {apt.service.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {apt.startDateTime.toLocaleDateString('es-ES')} · {apt.staff.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{formatCurrency(apt.totalAmount || 0)}</p>
                <span className={`text-[10px] px-2 py-1 rounded-full ${
                  apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {apt.status === 'completed' ? 'Completada' : apt.status}
                </span>
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
          No hay facturas registradas.
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-5">
        <h2 className="font-semibold mb-4">📋 Consentimientos</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
            <span className="text-sm">Política de privacidad</span>
            <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded-full">Aceptado</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
            <span className="text-sm">Marketing</span>
            <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded-full">
              {client.marketingConsent ? 'Aceptado' : 'No Aceptado'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
