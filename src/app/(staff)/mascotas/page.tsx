import Link from 'next/link'
import { Plus, Search, Dog, Cake, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getMascotas } from '@/actions/mascotas'

const sizeColors: Record<string, string> = {
  toy: 'bg-purple-100 text-purple-700',
  pequeno: 'bg-blue-100 text-blue-700',
  mediano: 'bg-amber-100 text-amber-700',
  grande: 'bg-rose-100 text-rose-700',
  gigante: 'bg-red-100 text-red-700',
}

const sizeLabels: Record<string, string> = {
  toy: 'Toy', pequeno: 'Pequeño', mediano: 'Mediano', grande: 'Grande', gigante: 'Gigante',
}

export default async function PetsPage() {
  const pets = await getMascotas()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mascotas</h1>
          <p className="text-sm text-muted-foreground mt-1">{pets.length} mascotas registradas</p>
        </div>
        <Link
          href="/mascotas/nueva"
          className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Nueva mascota
        </Link>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Buscar mascota..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <Link key={pet.id} href={`/mascotas/${pet.id}`}
            className="bg-white rounded-2xl border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Dog size={24} className="text-rose-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">{pet.name}</h3>
                <p className="text-xs text-muted-foreground">{pet.breed || 'Sin raza registrada'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default" className={`${sizeColors[pet.size] || 'bg-gray-100 text-gray-700'} border-0`}>
                    {sizeLabels[pet.size] || pet.size}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users size={12} /> {pet.owners.map(o => o.owner.name).join(', ')}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
