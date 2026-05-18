import Link from 'next/link'
import { ArrowLeft, Dog, Cake, Users, Scissors, Calendar, Camera, Edit3, Plus, Phone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getMascotaById } from '@/actions/mascotas'
import { formatCurrency } from '@/lib/utils/pricing'

const sizeLabels: Record<string, string> = {
  toy: 'Toy', pequeno: 'Pequeño', mediano: 'Mediano', grande: 'Grande', gigante: 'Gigante',
}

export default async function PetDetailPage({ params }: { params: { id: string } }) {
  const pet = await getMascotaById(params.id)

  if (!pet) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold mb-2">Mascota no encontrada</h1>
        <Link href="/mascotas" className="text-rose-500 hover:underline">Volver a mascotas</Link>
      </div>
    )
  }

  // Calculate age if birthDate is available
  // Not available in current schema, we'll assume age is not calculated for now or we just don't show it if it doesn't exist
  // We'll show mock age for now if we don't have birthdate in DB. 
  // Let's use the DB fields we have.

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
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow border flex items-center justify-center hover:bg-gray-50">
                <Camera size={12} className="text-gray-400" />
              </button>
            </div>
            <div>
              <h1 className="text-xl font-semibold">{pet.name}</h1>
              <p className="text-sm text-muted-foreground">{pet.breed || 'Sin raza especificada'}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default" className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200">
                  {sizeLabels[pet.size] || pet.size}
                </Badge>
                {pet.appointments.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Última visita: {pet.appointments[0].startDateTime.toLocaleDateString('es-ES')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit3 size={16} className="mr-1" /> Editar
            </Button>
            <Link href={`/citas/nueva?petId=${pet.id}`}>
              <Button size="sm">
                <Plus size={16} className="mr-1" /> Nueva cita
              </Button>
            </Link>
          </div>
        </div>

        {pet.notes && (
          <div className="mt-4 p-3 bg-amber-50 rounded-xl text-sm">
            <span className="font-medium">📋 Notas importantes: </span>{pet.notes}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-semibold">{pet.appointments.length}</p>
            <p className="text-xs text-muted-foreground">Visitas totales</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-semibold">{pet.owners.length}</p>
            <p className="text-xs text-muted-foreground">Dueños vinculados</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-semibold text-rose-600">
              {formatCurrency(pet.appointments.reduce((acc, apt) => acc + (apt.totalAmount || 0), 0))}
            </p>
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
          {pet.owners.map((ownerLink) => (
            <Link key={ownerLink.owner.id} href={`/clientes/${ownerLink.owner.id}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-rose-50 transition-colors"
            >
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-xs font-medium text-rose-600">
                {ownerLink.owner.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {ownerLink.owner.name}
                  {ownerLink.isPrimary && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px]">Principal</span>}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone size={12} /> {ownerLink.owner.phone}
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
          {pet.appointments.length === 0 ? (
            <div className="p-5 text-center text-sm text-muted-foreground">
              Sin historial de citas
            </div>
          ) : pet.appointments.map((apt) => (
            <div key={apt.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gray-100 rounded-lg">
                  <Scissors size={14} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{apt.service.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {apt.startDateTime.toLocaleDateString('es-ES')} · {apt.staff.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{formatCurrency(apt.totalAmount || 0)}</p>
                <span className={`text-[10px] px-2 py-1 rounded-full ${
                  apt.status === 'completed' ? 'bg-green-100 text-green-700' : 
                  apt.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {apt.status === 'completed' ? 'Completada' : apt.status}
                </span>
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
