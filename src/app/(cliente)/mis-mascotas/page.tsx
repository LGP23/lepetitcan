'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Dog, Plus, Cake, Calendar, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { getClientPetsAction } from '@/actions/mascotas'

export default function ClientPetsPage() {
  const { data: session } = useSession()
  const [pets, setPets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadPets = async () => {
    try {
      setLoading(true)
      const data = await getClientPetsAction()
      setPets(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPets()
  }, [])

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles size={24} className="text-rose-400" />
            Mis Mascotas
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">
            Administra tus consentidos registrados en Le Petit Can.
          </p>
        </div>
        <Link 
          href="/mis-mascotas/nueva" 
          className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm shadow-rose-200 hover:-translate-y-0.5 duration-200"
        >
          <Plus size={18} /> Añadir mascota
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-44 bg-gray-100 animate-pulse rounded-2xl"></div>
          <div className="h-44 bg-gray-100 animate-pulse rounded-2xl"></div>
        </div>
      ) : pets.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center text-gray-500 shadow-sm">
          <Dog size={52} className="text-gray-200 mx-auto mb-3" />
          <p className="font-semibold text-sm">No tienes mascotas registradas</p>
          <p className="text-xs text-gray-400 mt-1">¡Registra a tu mascota para poder agendar servicios de peluquería!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 shrink-0">
                    <Dog size={28} className="text-rose-500" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-gray-900">{pet.name}</h2>
                    <p className="text-xs text-gray-500 font-semibold">{pet.breed}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="default" className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-0 font-semibold text-[10px] px-2 py-0">
                        {pet.size.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                        <Cake size={11} /> Nacimiento: {pet.birthDate}
                      </span>
                    </div>
                  </div>
                </div>

                {pet.notes && (
                  <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-2.5 mt-3 border italic">
                    &ldquo;{pet.notes}&rdquo;
                  </p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/citas/nueva?pet=${pet.id}`} className="text-center p-2.5 bg-rose-50 hover:bg-rose-100 rounded-xl text-xs font-bold text-rose-700 transition-colors border border-rose-100">
                    Reservar cita
                  </Link>
                  <Link href={`/mis-citas?pet=${pet.id}`} className="text-center p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 transition-colors border">
                    Ver citas
                  </Link>
                </div>
                
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
                  <span>Última visita: <strong className="text-gray-700">{pet.lastVisit}</strong></span>
                  <Link href={`/mis-mascotas/${pet.id}`} className="text-rose-500 hover:text-rose-600 font-bold">
                    Editar mascota →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
