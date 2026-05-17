'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Dog, Scissors, Calendar, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const steps = ['Mascota', 'Servicio', 'Fecha', 'Confirmar']
const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30']

const mockServices = [
  { id: 'Corte de Pelo', name: 'Corte de Pelo', duration: 60 },
  { id: 'Baño Completo', name: 'Baño Completo', duration: 45 },
  { id: 'Desenredado', name: 'Desenredado y Deslanado', duration: 90 },
  { id: 'Corte de Uñas', name: 'Corte de Uñas', duration: 15 },
  { id: 'Limpieza Oídos', name: 'Limpieza de Oídos', duration: 15 },
  { id: 'Cepillado Dental', name: 'Cepillado Dental', duration: 15 },
]

export default function ClientNewAppointmentPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState({ pet: '', service: '', date: '', time: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSuccess(true)
    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto pt-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">¡Solicitud enviada!</h2>
        <p className="text-sm text-muted-foreground mb-6">Te confirmaremos la cita por WhatsApp.</p>
        <Button onClick={() => router.push('/citas')}>Ver mis citas</Button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Nueva cita</h1>

      <div className="flex items-center justify-center gap-1">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium ${i <= step ? 'bg-rose-400 text-white' : 'bg-gray-100 text-gray-400'}`}>{i + 1}</div>
            <span className={`text-[10px] ${i === step ? 'text-rose-600 font-medium' : 'text-gray-400'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`w-4 h-px ${i < step ? 'bg-rose-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border p-5">
        {step === 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-sm">¿Para qué mascota?</h2>
            <button onClick={() => { setSelected({ ...selected, pet: 'Luna' }); setStep(1) }}
              className="w-full flex items-center gap-3 p-4 border rounded-xl hover:bg-rose-50 transition-colors text-left">
              <Dog size={24} className="text-rose-400" />
              <div><p className="font-medium">Luna</p><p className="text-xs text-muted-foreground">Golden Retriever · Grande</p></div>
              <span className="ml-auto text-rose-500 text-sm font-medium">Seleccionar →</span>
            </button>
            <button onClick={() => setStep(1)} className="w-full text-center py-2 text-sm text-rose-500 hover:underline">
              + ¿Es tu primera vez? Cuéntanos
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-sm">¿Qué servicio necesitas?</h2>
            <div className="grid grid-cols-2 gap-2">
              {mockServices.map((svc) => (
                <button key={svc.id} onClick={() => { setSelected({ ...selected, service: svc.id }); setStep(2) }}
                  className={`p-3 border rounded-xl text-left transition-colors ${selected.service === svc.id ? 'bg-rose-50 border-rose-300' : 'hover:bg-gray-50'}`}>
                  <Scissors size={18} className="text-rose-400 mb-1" />
                  <p className="text-sm font-medium">{svc.name}</p>
                  <p className="text-[10px] text-muted-foreground">{svc.duration} min</p>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(0)} className="text-sm text-muted-foreground hover:text-gray-900">← Atrás</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-sm">¿Cuándo te viene bien?</h2>
            <div>
              <label className="block text-xs font-medium mb-1">Fecha</label>
              <input type="date" onChange={(e) => setSelected({ ...selected, date: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Hora</label>
              <div className="grid grid-cols-4 gap-1.5">
                {timeSlots.map((t) => (
                  <button key={t} onClick={() => setSelected({ ...selected, time: t })}
                    className={`py-2 border rounded-lg text-xs transition-colors ${selected.time === t ? 'bg-rose-50 border-rose-300 text-rose-700' : 'hover:bg-gray-50'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-gray-900">← Atrás</button>
              <button onClick={() => setStep(3)} disabled={!selected.date || !selected.time}
                className="ml-auto bg-rose-400 hover:bg-rose-500 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50">Continuar →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-sm">Confirma tu cita</h2>
            <div className="bg-rose-50 rounded-xl p-4 space-y-2 text-sm">
              <p className="flex items-center gap-2"><Dog size={16} className="text-rose-500" /> <strong>Luna</strong> · Golden · Grande</p>
              <p className="flex items-center gap-2"><Scissors size={16} className="text-rose-500" /> {mockServices.find((s) => s.id === selected.service)?.name}</p>
              <p className="flex items-center gap-2"><Calendar size={16} className="text-rose-500" /> {selected.date}</p>
              <p className="flex items-center gap-2"><Clock size={16} className="text-rose-500" /> {selected.time}</p>
            </div>
            <p className="text-xs text-muted-foreground">Al confirmar, aceptas nuestra Política de Privacidad.</p>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="text-sm text-muted-foreground hover:text-gray-900">← Atrás</button>
              <Button onClick={handleSubmit} disabled={submitting} className="ml-auto">
                {submitting ? 'Enviando...' : 'Confirmar cita'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
