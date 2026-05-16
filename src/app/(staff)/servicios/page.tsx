'use client'

import { useState } from 'react'
import { Scissors, Plus, Edit3, Clock, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils/pricing'

const mockServices = [
  {
    id: '1', name: 'Corte de Pelo', duration: '60 min', pricingModel: 'fixed',
    prices: { toy: 30, pequeno: 35, mediano: 40, grande: '50€ fijo / 35€/h', gigante: '45€/h' },
    active: true,
  },
  {
    id: '2', name: 'Baño Completo', duration: '45 min', pricingModel: 'fixed',
    prices: { toy: 20, pequeno: 25, mediano: 30, grande: 40, gigante: '50€/h' },
    active: true,
  },
  {
    id: '3', name: 'Desenredado y Deslanado', duration: '90 min', pricingModel: 'hourly',
    prices: { toy: '30€/h', pequeno: '30€/h', mediano: '30€/h', grande: '30€/h', gigante: '30€/h' },
    active: true,
  },
  {
    id: '4', name: 'Corte de Uñas', duration: '15 min', pricingModel: 'fixed',
    prices: { toy: 10, pequeno: 12, mediano: 12, grande: 15, gigante: '18€/h' },
    active: true,
  },
  {
    id: '5', name: 'Limpieza de Oídos', duration: '15 min', pricingModel: 'fixed',
    prices: { toy: 10, pequeno: 10, mediano: 12, grande: 15, gigante: '15€/h' },
    active: true,
  },
  {
    id: '6', name: 'Cepillado Dental', duration: '15 min', pricingModel: 'fixed',
    prices: { toy: 10, pequeno: 12, mediano: 12, grande: 15, gigante: '18€/h' },
    active: true,
  },
  {
    id: '7', name: 'Baño Spa & Arreglo', duration: '120 min', pricingModel: 'fixed',
    prices: { toy: 45, pequeno: 50, mediano: 60, grande: 80, gigante: '60€/h' },
    active: true,
  },
  {
    id: '8', name: 'Stripping Terriers', duration: '120 min', pricingModel: 'fixed',
    prices: { toy: '-', pequeno: '-', mediano: 55, grande: 75, gigante: '55€/h' },
    active: true,
  },
]

const sizeHeaders = ['Toy', 'Pequeño', 'Mediano', 'Grande', 'Gigante']
const sizeKeys = ['toy', 'pequeno', 'mediano', 'grande', 'gigante']

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Servicios</h1>
          <p className="text-sm text-muted-foreground mt-1">Catálogo de servicios y precios por talla</p>
        </div>
        <button className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Nuevo servicio
        </button>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Servicio</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  <Clock size={14} className="inline mr-1" />
                  Duración
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  <Tag size={14} className="inline mr-1" />
                  Modelo
                </th>
                {sizeHeaders.map((s) => (
                  <th key={s} className="text-center px-3 py-3 font-medium text-gray-500">{s}</th>
                ))}
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockServices.map((svc) => (
                <tr key={svc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium">{svc.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{svc.duration}</td>
                  <td className="px-4 py-3">
                    <Badge variant={svc.pricingModel === 'fixed' ? 'info' : 'warning'}>
                      {svc.pricingModel === 'fixed' ? 'Fijo' : 'Por hora'}
                    </Badge>
                  </td>
                  {sizeKeys.map((key) => (
                    <td key={key} className="px-3 py-3 text-center font-medium tabular-nums">
                      {typeof svc.prices[key as keyof typeof svc.prices] === 'number'
                        ? `${svc.prices[key as keyof typeof svc.prices]}€`
                        : svc.prices[key as keyof typeof svc.prices]}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit3 size={16} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        <p className="font-medium">💡 Recordatorio de precios</p>
        <p className="text-xs mt-1">
          Toy, Pequeño y Mediano tienen <strong>precios fijos</strong>. Grandes pueden ser fijo o por hora (según servicio).
          Gigantes siempre por hora.
        </p>
      </div>
    </div>
  )
}
