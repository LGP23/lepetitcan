'use client'

import { useState, useEffect } from 'react'
import { Plus, Dog, Phone, Clock, Send, CheckCircle2, X, Scissors, AlertCircle, FileText, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { getPipelineAppointments, updateAppointmentStatus, getAppointmentById, saveAppointmentCheckout } from '@/actions/citas'
import { formatCurrency } from '@/lib/utils/pricing'

const pipelineColumns = [
  { id: 'pending', label: 'Pendientes', color: 'bg-amber-50 border-amber-200', textColor: 'text-amber-700' },
  { id: 'confirmed', label: 'Confirmadas', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
  { id: 'in_progress', label: 'En curso', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700' },
  { id: 'ready', label: 'Listas recoger', color: 'bg-green-50 border-green-200', textColor: 'text-green-700' },
  { id: 'completed', label: 'Recogidas', color: 'bg-gray-50 border-gray-200', textColor: 'text-gray-500' },
]

export default function PipelinePage() {
  const [columns] = useState(pipelineColumns)
  const [pipelineData, setPipelineData] = useState<any>({
    pending: [], confirmed: [], in_progress: [], ready: [], completed: []
  })
  const [loading, setLoading] = useState(true)

  // Checkout modal states
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [actualHours, setActualHours] = useState<number>(1)
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bizum'>('card')
  const [supplements, setSupplements] = useState<{ id: string; label: string; amount: number; active: boolean }[]>([
    { id: 'nudos', label: 'Nudos extremos / Deslanado extra', amount: 15, active: false },
    { id: 'agresividad', label: 'Suplemento agresividad / Dificultad', amount: 10, active: false },
    { id: 'champu', label: 'Champú especial / Tratamiento de piel', amount: 5, active: false },
    { id: 'parasitos', label: 'Tratamiento antiparasitario', amount: 12, active: false },
  ])
  const [customSupplementLabel, setCustomSupplementLabel] = useState('')
  const [customSupplementAmount, setCustomSupplementAmount] = useState<string>('')
  const [addedCustomSupplements, setAddedCustomSupplements] = useState<{ label: string; amount: number }[]>([])

  const loadPipeline = async () => {
    setLoading(true)
    const data = await getPipelineAppointments()
    setPipelineData(data)
    setLoading(false)
  }

  useEffect(() => {
    loadPipeline()
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      loadPipeline()
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateAppointmentStatus(id, newStatus)
    loadPipeline()
  }

  const openCheckout = async (id: string) => {
    setSelectedAppointmentId(id)
    setModalLoading(true)
    setModalOpen(true)
    try {
      const app = await getAppointmentById(id)
      if (app) {
        setCheckoutData(app)
        setNotes(app.notes || '')
        setActualHours(app.estimatedHours || 1)
        setSupplements([
          { id: 'nudos', label: 'Nudos extremos / Deslanado extra', amount: 15, active: false },
          { id: 'agresividad', label: 'Suplemento agresividad / Dificultad', amount: 10, active: false },
          { id: 'champu', label: 'Champú especial / Tratamiento de piel', amount: 5, active: false },
          { id: 'parasitos', label: 'Tratamiento antiparasitario', amount: 12, active: false },
        ])
        setAddedCustomSupplements([])
        setCustomSupplementLabel('')
        setCustomSupplementAmount('')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setModalLoading(false)
    }
  }

  const getBasePrice = () => {
    if (!checkoutData) return 0
    const size = checkoutData.pet.size
    const service = checkoutData.service

    if (size === 'toy') return service.priceToy || 0
    if (size === 'pequeno') return service.pricePequeno || 0
    if (size === 'mediano') return service.priceMediano || 0
    if (size === 'grande') {
      if (checkoutData.priceType === 'hourly' || service.pricingModel === 'hourly') {
        return (service.priceGrandeHourly || 0) * actualHours
      }
      return service.priceGrandeFixed || 0
    }
    if (size === 'gigante') return (service.priceGiganteHourly || 0) * actualHours
    return 0
  }

  const calculateTotal = () => {
    const base = getBasePrice()
    const activeSups = supplements.filter(s => s.active).reduce((sum, s) => sum + s.amount, 0)
    const customSups = addedCustomSupplements.reduce((sum, s) => sum + s.amount, 0)
    return base + activeSups + customSups
  }

  const toggleSupplement = (id: string) => {
    setSupplements(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  const addCustomSupplement = () => {
    if (!customSupplementLabel.trim() || !customSupplementAmount) return
    const amountNum = parseFloat(customSupplementAmount)
    if (isNaN(amountNum)) return

    setAddedCustomSupplements(prev => [...prev, { label: customSupplementLabel.trim(), amount: amountNum }])
    setCustomSupplementLabel('')
    setCustomSupplementAmount('')
  }

  const removeCustomSupplement = (index: number) => {
    setAddedCustomSupplements(prev => prev.filter((_, i) => i !== index))
  }

  const handleSaveCheckout = async (status: string) => {
    if (!selectedAppointmentId) return
    const total = calculateTotal()
    
    const activeSupsText = supplements
      .filter(s => s.active)
      .map(s => `${s.label} (+${s.amount}€)`)
      .concat(addedCustomSupplements.map(s => `${s.label} (+${s.amount}€)`))
      .join(', ')

    const checkoutNotes = `
[Suplementos]: ${activeSupsText || 'Ninguno'}
[Horas reales]: ${actualHours}h
[Notas sesión]: ${notes}
    `.trim()

    try {
      await saveAppointmentCheckout(selectedAppointmentId, {
        actualHours,
        totalAmount: total,
        notes: checkoutNotes,
        status,
        paymentMethod
      })
      setModalOpen(false)
      loadPipeline()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pipeline del día</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          href="/citas/nueva"
          className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Nueva cita
        </Link>
      </div>

      <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-200px)]">
        {columns.map((col) => {
          const items = pipelineData[col.id as keyof typeof pipelineData] || []
          return (
            <div key={col.id} className="flex flex-col min-w-[220px]">
              <div className={`flex items-center justify-between px-3 py-2 rounded-t-xl border ${col.color}`}>
                <span className={`text-sm font-medium ${col.textColor}`}>{col.label}</span>
                <Badge variant="default">{items.length}</Badge>
              </div>

              <div className={`flex-1 border-x border-b rounded-b-xl p-2 space-y-2 bg-gray-50/50 ${col.id === 'in_progress' ? 'min-h-[400px]' : ''}`}>
                {loading && items.length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground animate-pulse">
                    Cargando...
                  </div>
                ) : items.map((item: any) => (
                  <div key={item.id} className="bg-white rounded-xl border p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Dog size={16} className="text-rose-500" />
                        <span className="font-medium text-sm hover:underline">
                          <Link href={`/mascotas/${item.petId}`}>{item.pet}</Link>
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 font-medium">{item.service}</p>
                    <p className="text-xs text-muted-foreground hover:underline">
                      <Link href={`/clientes/${item.ownerId}`}>{item.owner}</Link>
                    </p>

                    {'step' in item && (
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <Clock size={12} className="text-purple-500" />
                        <span className="text-purple-600 font-medium">{(item as any).step} · {(item as any).elapsed}</span>
                      </div>
                    )}

                    {'pickedUp' in item && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle2 size={12} />
                        <span>Recogida {(item as any).pickedUp}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-50">
                      <a href={`tel:${item.phone}`} className="p-1 hover:bg-gray-100 rounded-lg transition-colors" title="Llamar">
                        <Phone size={14} className="text-gray-400" />
                      </a>
                      
                      {col.id === 'ready' && (
                        <div className="ml-auto flex items-center gap-1">
                          <button 
                            onClick={() => handleStatusChange(item.id, 'completed')}
                            className="p-1 hover:bg-green-100 rounded-lg transition-colors" 
                            title="Avisar recogida"
                          >
                            <Send size={14} className="text-green-500" />
                          </button>
                          <button 
                            onClick={() => openCheckout(item.id)}
                            className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg hover:bg-green-100 transition-colors font-medium"
                          >
                            Cobrar
                          </button>
                        </div>
                      )}
                      
                      {col.id === 'in_progress' && (
                        <button 
                          onClick={() => openCheckout(item.id)}
                          className="ml-auto text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          Completar
                        </button>
                      )}
                      
                      {col.id === 'confirmed' && (
                        <button 
                          onClick={() => handleStatusChange(item.id, 'in_progress')}
                          className="ml-auto text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Check-in
                        </button>
                      )}

                      {col.id === 'pending' && (
                        <button 
                          onClick={() => handleStatusChange(item.id, 'confirmed')}
                          className="ml-auto text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-lg hover:bg-amber-100 transition-colors"
                        >
                          Confirmar
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {!loading && items.length === 0 && (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    Sin citas
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Checkout Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-rose-50 to-purple-50">
              <div>
                <h2 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                  <Scissors size={20} className="text-rose-500" />
                  Finalizar y Cobrar Cita
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Calcula el precio y registra observaciones</p>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1.5 hover:bg-white rounded-full text-gray-400 hover:text-gray-600 transition-colors border shadow-sm"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            {modalLoading ? (
              <div className="p-12 text-center text-sm text-muted-foreground animate-pulse">
                Cargando datos de la cita...
              </div>
            ) : checkoutData && (
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                
                {/* Pet & Service Detail Card */}
                <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between text-xs border">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                      <Dog size={16} className="text-rose-500" />
                      {checkoutData.pet.name}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {checkoutData.pet.breed || 'Sin raza'} · {checkoutData.pet.size.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl inline-block border border-purple-100">
                      {checkoutData.service.name}
                    </p>
                    <p className="text-muted-foreground text-[10px] mt-1">{checkoutData.owner.name}</p>
                  </div>
                </div>

                {/* Pricing Calculation Section */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Precio de la Sesión</h3>
                  
                  {/* Base price with size mapping */}
                  <div className="flex items-center justify-between p-3 border rounded-xl bg-white text-sm">
                    <div>
                      <span className="font-medium">Precio base ({checkoutData.pet.size})</span>
                      <p className="text-[10px] text-muted-foreground">Tarifa configurada en catálogo</p>
                    </div>
                    <span className="font-semibold text-gray-900">{formatCurrency(getBasePrice())}</span>
                  </div>

                  {/* Hourly rate input if applicable */}
                  {(checkoutData.pet.size === 'grande' || checkoutData.pet.size === 'gigante') && 
                    (checkoutData.priceType === 'hourly' || checkoutData.service.pricingModel === 'hourly') && (
                      <div className="p-3 border border-purple-100 rounded-xl bg-purple-50/50 flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium text-purple-900">Horas reales trabajadas</span>
                          <p className="text-[10px] text-purple-700">Tarifa: {formatCurrency(checkoutData.pet.size === 'grande' ? checkoutData.service.priceGrandeHourly : checkoutData.service.priceGiganteHourly)}/h</p>
                        </div>
                        <input 
                          type="number" 
                          min={0.5} 
                          step={0.5} 
                          value={actualHours}
                          onChange={(e) => setActualHours(Math.max(0.5, parseFloat(e.target.value) || 1))}
                          className="w-16 px-2 py-1 text-center bg-white border border-purple-200 rounded-lg text-purple-950 focus:outline-none focus:ring-1 focus:ring-purple-400 text-sm font-semibold"
                        />
                      </div>
                    )
                  }
                </div>

                {/* Supplements list */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Suplementos de la Sesión</h3>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {supplements.map((sup) => (
                      <button
                        key={sup.id}
                        onClick={() => toggleSupplement(sup.id)}
                        className={`flex items-center justify-between p-2.5 border rounded-xl text-left transition-all ${
                          sup.active 
                            ? 'bg-rose-50 border-rose-200 ring-1 ring-rose-200 text-rose-950 font-medium' 
                            : 'bg-white border-gray-100 hover:bg-gray-50/50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            sup.active ? 'bg-rose-400 border-rose-400 text-white' : 'border-gray-300 bg-white'
                          }`}>
                            {sup.active && <Check size={10} strokeWidth={3} />}
                          </div>
                          <span>{sup.label}</span>
                        </div>
                        <Badge variant="default" className={`${sup.active ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'} border-0`}>
                          +{formatCurrency(sup.amount)}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Supplements Add Section */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-[11px] font-semibold text-gray-400 uppercase">Otro Suplemento Personalizado</h4>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Concepto (ej. Nudos extremos cola)" 
                      value={customSupplementLabel}
                      onChange={(e) => setCustomSupplementLabel(e.target.value)}
                      className="flex-1 px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-300"
                    />
                    <input 
                      type="number" 
                      placeholder="Precio (€)" 
                      value={customSupplementAmount}
                      onChange={(e) => setCustomSupplementAmount(e.target.value)}
                      className="w-20 px-2 py-1.5 border rounded-xl text-xs text-center focus:outline-none focus:ring-1 focus:ring-rose-300"
                    />
                    <button
                      onClick={addCustomSupplement}
                      className="bg-rose-400 hover:bg-rose-500 text-white px-3.5 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors"
                    >
                      Añadir
                    </button>
                  </div>

                  {/* Added custom supplements list */}
                  {addedCustomSupplements.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {addedCustomSupplements.map((cs, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-amber-50/50 border border-amber-100 rounded-xl text-xs text-amber-950 font-medium">
                          <span>{cs.label}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="bg-amber-100 text-amber-800 border-0">+{formatCurrency(cs.amount)}</Badge>
                            <button 
                              onClick={() => removeCustomSupplement(idx)}
                              className="text-amber-500 hover:text-rose-600 transition-colors p-0.5 rounded-full hover:bg-amber-100"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Session Notes */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <FileText size={14} /> Notas Clínicas / Groomer Notes
                  </h3>
                  <textarea 
                    rows={3} 
                    placeholder="Escribe recomendaciones, tipo de champú utilizado o hallazgos (ej: otitis leve o piel irritada)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-300 bg-white"
                  />
                </div>

                {/* Método de Pago Selector */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Método de Pago</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'cash', label: 'Efectivo', icon: '💰' },
                      { value: 'card', label: 'Tarjeta', icon: '💳' },
                      { value: 'bizum', label: 'Bizum', icon: '📱' },
                    ].map((method) => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setPaymentMethod(method.value as any)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                          paymentMethod === method.value
                            ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold scale-[1.02]'
                            : 'bg-white hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <span className="text-lg mb-1">{method.icon}</span>
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Price Total Header */}
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between">
                  <span className="font-semibold text-sm text-rose-950">Total Calculado</span>
                  <span className="text-2xl font-black text-rose-600">{formatCurrency(calculateTotal())}</span>
                </div>

              </div>
            )}

            {/* Modal Footer actions */}
            <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between gap-3">
              <button 
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border hover:bg-white rounded-xl text-xs font-medium text-gray-600 transition-colors bg-gray-100/50"
              >
                Cancelar
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveCheckout('ready')}
                  className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-semibold transition-colors border border-purple-200"
                >
                  Listo para Recoger
                </button>
                <button
                  onClick={() => handleSaveCheckout('completed')}
                  className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <CheckCircle2 size={14} />
                  Cobrar y Entregar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

