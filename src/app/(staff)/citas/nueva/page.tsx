'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Dog, Scissors } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClientSearch } from '@/components/forms/client-search'
import { formatCurrency } from '@/lib/utils/pricing'

const mockServices = [
  { id: 'Corte de Pelo', name: 'Corte de Pelo', duration: 60, prices: 'Fijo/Desde 30€' },
  { id: 'Baño Completo', name: 'Baño Completo', duration: 45, prices: 'Fijo/Desde 20€' },
  { id: 'Desenredado y Deslanado', name: 'Desenredado y Deslanado', duration: 90, prices: '30€/hora' },
  { id: 'Corte de Uñas', name: 'Corte de Uñas', duration: 15, prices: 'Fijo/Desde 10€' },
  { id: 'Limpieza de Oídos', name: 'Limpieza de Oídos', duration: 15, prices: 'Fijo/Desde 10€' },
  { id: 'Cepillado Dental', name: 'Cepillado Dental', duration: 15, prices: 'Fijo/Desde 10€' },
]

const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30']

export default function NewAppointmentPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    ownerId: '', petId: '', serviceId: '', staffId: '',
    date: '', time: '', duration: 60,
    priceType: 'fixed' as 'fixed' | 'hourly',
    estimatedHours: 1, notes: '', source: 'presencial',
  })

  function handleClientSelect(client: any) {
    setForm({ ...form, ownerId: client.id })
    setStep(2)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert('Cita creada (modo demo)')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/citas" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gray-900">
        <ArrowLeft size={16} /> Volver a citas
      </Link>

      <h1 className="text-2xl font-semibold">Nueva cita</h1>

      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
              s <= step ? 'bg-rose-400 text-white' : 'bg-gray-100 text-gray-400'
            }`}>{s}</div>
            <span className={`text-xs ${s === step ? 'text-rose-600 font-medium' : 'text-gray-400'}`}>
              {['Cliente', 'Mascota', 'Servicio', 'Confirmar'][s - 1]}
            </span>
            {s < 4 && <div className={`w-6 h-px ${s < step ? 'bg-rose-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Seleccionar cliente</h2>
            <ClientSearch onSelect={handleClientSelect} />
            <p className="text-xs text-muted-foreground mt-2">
              ¿Cliente nuevo?{' '}
              <Link href="/clientes/nuevo" className="text-rose-500 hover:underline">Crear cliente</Link>
              {' '}y vuelve aquí.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Seleccionar mascota</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Luna (Golden · Grande)', 'Kira (Shih Tzu · Pequeño)'].map((p) => (
                <button key={p}
                  onClick={() => setStep(3)}
                  className="flex items-center gap-3 p-4 border rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-colors text-left"
                >
                  <Dog size={24} className="text-rose-400" />
                  <div>
                    <p className="text-sm font-medium">{p.split(' (')[0]}</p>
                    <p className="text-xs text-muted-foreground">{p.split('(')[1]?.replace(')', '')}</p>
                  </div>
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={() => setStep(1)}>← Atrás</Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Servicio y horario</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Servicio</label>
              <div className="grid grid-cols-2 gap-2">
                {mockServices.map((svc) => (
                  <button key={svc.id}
                    onClick={() => setForm({ ...form, serviceId: svc.id, duration: svc.duration })}
                    className={`flex items-start gap-3 p-3 border rounded-xl text-left transition-colors ${
                      form.serviceId === svc.id ? 'bg-rose-50 border-rose-300' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Scissors size={18} className="text-rose-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{svc.name}</p>
                      <p className="text-xs text-muted-foreground">{svc.prices}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fecha</label>
                <input type="date"
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hora</label>
                <select onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white">
                  <option value="">Seleccionar...</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notas</label>
              <textarea onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 h-20"
                placeholder="Alergias, comportamiento, observaciones..." />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>← Atrás</Button>
              <Button onClick={() => setStep(4)} disabled={!form.serviceId || !form.date || !form.time}>
                Continuar →
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Confirmar cita</h2>

            <div className="bg-rose-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Dog size={16} className="text-rose-500" />
                <span className="font-medium">Luna</span> · Golden Retriever · Grande
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Scissors size={16} className="text-rose-500" />
                {mockServices.find((s) => s.id === form.serviceId)?.name || 'Servicio'}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-rose-500" />
                {form.date || 'Fecha'} · {form.time || 'Hora'}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-rose-500" />
                {form.duration} min
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-3 text-sm">
              <p className="font-medium text-amber-800">💰 Precio estimado</p>
              <p className="text-amber-600 text-xs mt-1">
                El precio se calculará según el tamaño de la mascota y el servicio seleccionado.
                Toy/Peq/Med: precio fijo. Grande/Gigante: según servicio (fijo u horas).
              </p>
            </div>

            {form.notes && (
              <div className="p-3 bg-gray-50 rounded-xl text-sm">
                <span className="font-medium">📝 Notas: </span>{form.notes}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep(3)}>← Atrás</Button>
              <Button onClick={handleSubmit}>
                Confirmar y crear cita
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
