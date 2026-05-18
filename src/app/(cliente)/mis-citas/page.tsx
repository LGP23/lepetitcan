'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Plus, Calendar, Clock, Dog, DollarSign, Scissors, ShieldAlert, Sparkles, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getClientAppointmentsAction } from '@/actions/citas'

export default function ClientAppointmentsPage() {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedAptId, setExpandedAptId] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getClientAppointmentsAction()
      setAppointments(data.upcoming || [])
      setHistory(data.history || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // Auto-refresh every 30 seconds for live progress tracking
    const interval = setInterval(() => {
      loadData()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-semibold border border-amber-200">Pendiente</span>
      case 'confirmed':
        return <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold border border-blue-200">Confirmada</span>
      case 'in_progress':
        return (
          <span className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-semibold border border-purple-200 flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping"></span>
            En peluquería
          </span>
        )
      case 'ready':
        return (
          <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold border border-green-300 shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce"></span>
            ¡Listo para recoger!
          </span>
        )
      default:
        return <span className="text-xs bg-gray-50 text-gray-700 px-3 py-1 rounded-full font-semibold border">{status}</span>
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-2">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles size={24} className="text-rose-400" />
            Mis Citas y Peluquería
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Hola, {session?.user?.name || 'Cliente'} 👋🏼 ¡Sigue el progreso de tu consentido!
          </p>
        </div>
        <Link
          href="/citas/nueva"
          className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm shadow-rose-200 hover:-translate-y-0.5 duration-200"
        >
          <Plus size={18} />
          Reservar cita
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-28 bg-gray-100/80 animate-pulse rounded-2xl"></div>
          <div className="h-48 bg-gray-100/50 animate-pulse rounded-2xl"></div>
        </div>
      ) : (
        <>
          {/* Active / Upcoming Appointments */}
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Peluquería en tiempo real y próximas citas</h2>
            {appointments.length === 0 ? (
              <div className="bg-white rounded-2xl border p-8 text-center text-gray-500 shadow-sm">
                <Dog size={48} className="text-gray-200 mx-auto mb-3" />
                <p className="font-semibold text-sm">No tienes citas activas ni programadas</p>
                <p className="text-xs text-gray-400 mt-1">¿Le hace falta un retoque a tu mascota? ¡Reserva una cita ahora!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => {
                  const isExpanded = expandedAptId === apt.id
                  const showTracker = apt.status === 'in_progress' || apt.status === 'ready'
                  
                  return (
                    <div 
                      key={apt.id} 
                      className={`bg-white rounded-2xl border transition-all shadow-sm hover:shadow-md ${
                        apt.status === 'ready' ? 'border-green-300 bg-green-50/5' : 'border-gray-150'
                      }`}
                    >
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${
                            apt.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-rose-50 text-rose-500'
                          }`}>
                            <Dog size={24} className="animate-pulse" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-black text-gray-900 text-base">{apt.pet}</h3>
                              <Badge variant="default" className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0 font-medium">
                                {apt.service}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 font-medium">
                              <span className="flex items-center gap-1">
                                <Calendar size={13} className="text-gray-400" /> {apt.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={13} className="text-gray-400" /> {apt.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                          {getStatusBadge(apt.status)}
                          {showTracker && (
                            <button
                              onClick={() => setExpandedAptId(isExpanded ? null : apt.id)}
                              className="text-xs text-rose-400 hover:text-rose-600 font-semibold flex items-center gap-0.5 mt-1 transition-colors"
                            >
                              {isExpanded ? (
                                <>Ocultar progreso <ChevronUp size={14} /></>
                              ) : (
                                <>Ver progreso en vivo <ChevronDown size={14} /></>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Live Tracker (Uber Eats for Pets) */}
                      {showTracker && isExpanded && (
                        <div className="px-5 pb-5 pt-3 bg-gradient-to-b from-white to-rose-50/10 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="relative">
                            {/* Connector Line */}
                            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 z-0">
                              <div 
                                className="h-full bg-rose-400 transition-all duration-500" 
                                style={{ width: apt.status === 'ready' ? '100%' : '50%' }}
                              />
                            </div>

                            {/* Steps */}
                            <div className="relative z-10 flex justify-between text-center">
                              {/* Step 1: Confirmed */}
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-rose-400 text-white flex items-center justify-center font-bold text-xs shadow-md">
                                  ✓
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold text-rose-950 mt-2">Check-in</span>
                                <span className="text-[9px] text-gray-400">Recibido</span>
                              </div>

                              {/* Step 2: Grooming */}
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-colors ${
                                  apt.status === 'in_progress' ? 'bg-purple-500 text-white animate-bounce' :
                                  apt.status === 'ready' ? 'bg-rose-400 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                  {apt.status === 'ready' ? '✓' : <Scissors size={14} />}
                                </div>
                                <span className={`text-[10px] sm:text-xs font-bold mt-2 ${
                                  apt.status === 'in_progress' ? 'text-purple-700' : 
                                  apt.status === 'ready' ? 'text-rose-950' : 'text-gray-400'
                                }`}>En sesión</span>
                                <span className="text-[9px] text-gray-400">Peluquería / Baño</span>
                              </div>

                              {/* Step 3: Ready */}
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-colors ${
                                  apt.status === 'ready' ? 'bg-green-500 text-white animate-pulse ring-4 ring-green-100' : 'bg-gray-200 text-gray-500'
                                }`}>
                                  <Sparkles size={14} />
                                </div>
                                <span className={`text-[10px] sm:text-xs font-bold mt-2 ${
                                  apt.status === 'ready' ? 'text-green-700' : 'text-gray-400'
                                }`}>¡Listo!</span>
                                <span className="text-[9px] text-gray-400">Listo para recoger</span>
                              </div>
                            </div>
                          </div>

                          {/* Detail Message */}
                          <div className="mt-6 p-3 bg-gray-50 rounded-xl border text-xs text-gray-600 flex items-start gap-2.5">
                            <ShieldAlert size={16} className="text-purple-500 shrink-0 mt-0.5" />
                            <div>
                              {apt.status === 'in_progress' ? (
                                <p className="font-medium text-gray-800">
                                  ¡{apt.pet} está en las mejores manos! Nuestro estilista está aplicando champú premium, desenredando y dándole un corte espectacular. El progreso se actualiza en vivo.
                                </p>
                              ) : (
                                <p className="font-bold text-green-950">
                                  ¡Estupendas noticias! La sesión ha finalizado y {apt.pet} ha quedado impecable. Puedes pasar por Le Petit Can cuando desees para recogerle. ¡Te esperamos!
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Historical Appointments */}
          <div className="pt-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Historial de Visitas</h2>
            {history.length === 0 ? (
              <div className="bg-white rounded-2xl border p-6 text-center text-gray-400 text-xs shadow-sm">
                No tienes visitas completadas anteriormente en el sistema.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border divide-y shadow-sm overflow-hidden">
                {history.map((apt) => (
                  <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg text-gray-500 border">
                        <CheckCircle2 size={16} className="text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{apt.pet} · <span className="font-medium text-gray-600">{apt.service}</span></p>
                        <p className="text-xs text-gray-400 mt-0.5">{apt.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-rose-500">{apt.amount}</p>
                      <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Pagado</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
