'use client'

import { useState } from 'react'
import { Plus, Search, Package, Edit3 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils/pricing'

const mockProducts = [
  { id: '1', name: 'Champú Spa Calmante', price: 25, size: '250ml', category: 'Champús' },
  { id: '2', name: 'Champú Spa Calmante', price: 38, size: '500ml', category: 'Champús' },
  { id: '3', name: 'Acondicionador Hydra', price: 25, size: '250ml', category: 'Acondicionadores' },
  { id: '4', name: 'Acondicionador Hydra', price: 38, size: '500ml', category: 'Acondicionadores' },
  { id: '5', name: 'Pack Spa Completo', price: 65, size: 'Kit', category: 'Kits' },
  { id: '6', name: 'Peine Grooming Pro', price: 18, size: 'Uni', category: 'Herramientas' },
  { id: '7', name: 'Carda Grooming Pro', price: 22, size: 'Uni', category: 'Herramientas' },
  { id: '8', name: 'Perfume Canino', price: 15, size: '100ml', category: 'Perfumes' },
]

const categories = ['Todas', 'Champús', 'Acondicionadores', 'Kits', 'Herramientas', 'Perfumes']

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('Todas')
  const filtered = activeCategory === 'Todas' ? mockProducts : mockProducts.filter((p) => p.category === activeCategory)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Artículos</h1>
          <p className="text-sm text-muted-foreground mt-1">Catálogo de productos para venta</p>
        </div>
        <button className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Nuevo artículo
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border p-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-3">
              <Package size={24} className="text-rose-500" />
            </div>
            <h3 className="font-medium text-sm">{product.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{product.size}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-lg font-semibold text-rose-600">{formatCurrency(product.price)}</span>
              <Badge variant="default">{product.category}</Badge>
            </div>
            <div className="mt-3 pt-3 border-t flex justify-end">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <Edit3 size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
