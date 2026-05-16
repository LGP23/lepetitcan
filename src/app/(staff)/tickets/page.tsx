'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClientSearch } from '@/components/forms/client-search'
import { Plus, Trash2, Printer, FileText, Euro } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/pricing'

interface LineItem {
  id: string
  type: 'service' | 'product'
  name: string
  quantity: number
  unitPrice: number
  total: number
}

export default function TPVPage() {
  const [items, setItems] = useState<LineItem[]>([])
  const [client, setClient] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bizum' | null>(null)

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const iva = subtotal * 0.21
  const total = subtotal + iva

  function addService(service: { name: string; price: number }) {
    setItems([...items, {
      id: Math.random().toString(36),
      type: 'service',
      name: service.name,
      quantity: 1,
      unitPrice: service.price,
      total: service.price,
    }])
  }

  function removeItem(id: string) {
    setItems(items.filter((i) => i.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">TPV - Punto de Venta</h1>
        <p className="text-sm text-muted-foreground mt-1">Nuevo ticket de venta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientSearch onSelect={setClient} />
              {client && (
                <div className="mt-3 p-3 bg-rose-50 rounded-xl">
                  <p className="font-medium text-sm">{client.name}</p>
                  <p className="text-xs text-muted-foreground">{client.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Servicios</CardTitle>
              <Button variant="outline" size="sm">
                <Plus size={16} className="mr-1" /> Añadir servicio
              </Button>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Añade servicios o productos al ticket
                </p>
              ) : (
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.type === 'service' ? 'Servicio' : 'Producto'} · {item.quantity}x {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{formatCurrency(item.total)}</span>
                        <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['Champú Spa 250ml - 25€', 'Acondicionador Hydra - 25€', 'Peine Grooming - 18€'].map((p) => (
                  <button
                    key={p}
                    onClick={() => addService({ name: p, price: parseInt(p.match(/\d+/)?.[0] || '0') })}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-rose-50 border rounded-lg text-sm transition-colors"
                  >
                    + {p}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base imponible</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA 21%</span>
                <span>{formatCurrency(iva)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-3">
                <span>TOTAL</span>
                <span className="text-rose-600">{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Método de pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { value: 'cash', label: 'Efectivo', icon: '💰' },
                { value: 'card', label: 'Tarjeta', icon: '💳' },
                { value: 'bizum', label: 'Bizum', icon: '📱' },
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    paymentMethod === method.value
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span>{method.icon}</span>
                  {method.label}
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button className="w-full" disabled={items.length === 0 || !paymentMethod}>
              <Euro size={18} className="mr-2" /> Cobrar {formatCurrency(total)}
            </Button>
            <Button variant="outline" className="w-full" disabled={items.length === 0}>
              <Printer size={18} className="mr-2" /> Imprimir ticket
            </Button>
            <Button variant="outline" className="w-full" disabled={items.length === 0}>
              <FileText size={18} className="mr-2" /> Generar factura
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
