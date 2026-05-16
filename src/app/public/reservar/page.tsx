'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Dog, Calendar, Clock } from 'lucide-react'

const steps = ['Tus datos', 'Tu mascota', 'Servicio y horario', 'Confirmar']

const mockServices = [
  { id: '1', name: 'Corte de Pelo', duration: '60 min' },
  { id: '2', name: 'Baño Completo', duration: '45 min' },
  { id: '3', name: 'Desenredado y Deslanado', duration: '90 min' },
  { id: '4', name: 'Corte de Uñas', duration: '15 min' },
  { id: '5', name: 'Limpieza de Oídos', duration: '15 min' },
  { id: '6', name: 'Cepillado Dental', duration: '15 min' },
]

const mockSlots = ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00']

export default function PublicBookingPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', source: '',
    petName: '', breed: '', size: '',
    service: '', date: '', time: '', notes: '',
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-rose-500">Le Petit Can</h1>
          <p className="text-muted-foreground text-sm mt-1">Reserva tu cita</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                i <= step ? 'bg-rose-400 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs ${i === step ? 'text-rose-600 font-medium' : 'text-gray-400'}`}>
                {s}
              </span>
              {i < steps.length - 1 && <div className={`w-6 h-px ${i < step ? 'bg-rose-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-6">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Tus datos</h2>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre completo</label>
                <input type="text" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input type="tel" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" placeholder="+34" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" placeholder="tu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">¿Cómo nos conociste?</label>
                <select className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white">
                  <option>Seleccionar...</option>
                  <option>Instagram</option>
                  <option>Facebook</option>
                  <option>Google</option>
                  <option>WhatsApp</option>
                  <option>Recomendación</option>
                  <option>Otro</option>
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Tu mascota</h2>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input type="text" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" placeholder="Nombre de tu mascota" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Raza</label>
                <input type="text" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" placeholder="Ej: Golden Retriever" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tamaño</label>
                <div className="grid grid-cols-5 gap-2">
                  {['Toy', 'Peq', 'Med', 'Gr', 'Gig'].map((s) => (
                    <button key={s} className="p-3 border rounded-xl text-xs font-medium hover:bg-rose-50 hover:border-rose-300 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha de nacimiento (opcional)</label>
                <input type="date" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Servicio y horario</h2>
              <div>
                <label className="block text-sm font-medium mb-1">Servicio</label>
                <div className="grid grid-cols-2 gap-2">
                  {mockServices.map((s) => (
                    <button key={s.id} className="p-3 border rounded-xl text-left hover:bg-rose-50 hover:border-rose-300 transition-colors">
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.duration}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha preferente</label>
                <input type="date" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Horario preferente</label>
                <div className="flex flex-wrap gap-2">
                  {mockSlots.map((s) => (
                    <button key={s} className="px-4 py-2 border rounded-xl text-sm hover:bg-rose-50 hover:border-rose-300 transition-colors">{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notas</label>
                <textarea className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 h-20" placeholder="Algo que debamos saber..." />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Confirma tu reserva</h2>
              <div className="bg-rose-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Dog size={16} className="text-rose-500" /> <span className="font-medium">Luna</span> · Golden · Mediano
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-rose-500" /> 19 de junio de 2026
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-rose-500" /> Corte de Pelo · 10:00
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Al enviar la solicitud, aceptas nuestra{' '}
                <a href="/politica-privacidad" className="text-rose-500 underline">Política de Privacidad</a>.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-gray-900">
                <ChevronLeft size={18} /> Atrás
              </button>
            ) : <div />}
            <button
              onClick={() => step < 3 ? setStep(step + 1) : alert('¡Solicitud enviada!')}
              className="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              {step === 3 ? 'Solicitar cita' : 'Continuar'}
              {step < 3 && <ChevronRight size={18} className="inline ml-1" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
