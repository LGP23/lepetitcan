'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Dog } from 'lucide-react'
import { Button } from '@/components/ui/button'

const sizes = [
  { id: 'toy', label: 'Toy', desc: 'Hasta 5 kg', icon: '🧸' },
  { id: 'pequeno', label: 'Pequeño', desc: '5-10 kg', icon: '🐕' },
  { id: 'mediano', label: 'Mediano', desc: '10-25 kg', icon: '🐕' },
  { id: 'grande', label: 'Grande', desc: '25-45 kg', icon: '🐕‍🦺' },
  { id: 'gigante', label: 'Gigante', desc: '+45 kg', icon: '🦮' },
]

export default function NewPetPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', breed: '', size: '', birthDate: '', notes: '', ownerIds: [] as string[],
  })
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/v1/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ownerIds: ['1'] }),
      })
      if (res.ok) {
        const json = await res.json()
        router.push(`/mascotas/${json.data.id}`)
      }
    } catch {
      alert('Error al guardar')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/mascotas" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gray-900">
        <ArrowLeft size={16} /> Volver a mascotas
      </Link>

      <h1 className="text-2xl font-semibold">Nueva mascota</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Raza</label>
            <input type="text" value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" placeholder="Ej: Golden Retriever" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de nacimiento</label>
            <input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tamaño *</label>
          <div className="grid grid-cols-5 gap-2">
            {sizes.map((s) => (
              <button key={s.id} type="button" onClick={() => setForm({ ...form, size: s.id })}
                className={`p-3 border rounded-xl text-center transition-colors ${
                  form.size === s.id ? 'bg-rose-50 border-rose-300' : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{s.icon}</span>
                <p className="text-xs font-medium mt-1">{s.label}</p>
                <p className="text-[10px] text-muted-foreground">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notas</label>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 h-20"
            placeholder="Alergias, comportamiento, cuidados especiales..." />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link href="/mascotas">
            <Button type="button" variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={saving || !form.name || !form.size}>
            <Save size={18} className="mr-1" />
            {saving ? 'Guardando...' : 'Guardar mascota'}
          </Button>
        </div>
      </form>
    </div>
  )
}
