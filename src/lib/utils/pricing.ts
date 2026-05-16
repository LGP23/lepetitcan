import { PetSize, PriceType, ServiceCatalog } from '@prisma/client'

export interface PriceInput {
  size: PetSize
  service: Pick<ServiceCatalog, 'pricingModel' | 'priceToy' | 'pricePequeno' | 'priceMediano' | 'priceGrandeFixed' | 'priceGrandeHourly' | 'priceGiganteHourly'>
  hours?: number
}

export interface PriceResult {
  price: number
  priceType: PriceType
  hourlyRate?: number
  totalHours?: number
  breakdown: string
}

export function calculatePrice(input: PriceInput): PriceResult {
  const { size, service, hours } = input

  switch (size) {
    case 'toy':
      if (!service.priceToy) throw new Error(`No hay precio para Toy en ${service}`)
      return { price: Number(service.priceToy), priceType: 'fixed', breakdown: `Precio fijo Toy: ${service.priceToy}€` }

    case 'pequeno':
      if (!service.pricePequeno) throw new Error(`No hay precio para Pequeño en ${service}`)
      return { price: Number(service.pricePequeno), priceType: 'fixed', breakdown: `Precio fijo Pequeño: ${service.pricePequeno}€` }

    case 'mediano':
      if (!service.priceMediano) throw new Error(`No hay precio para Mediano en ${service}`)
      return { price: Number(service.priceMediano), priceType: 'fixed', breakdown: `Precio fijo Mediano: ${service.priceMediano}€` }

    case 'grande':
      if (service.pricingModel === 'fixed') {
        if (!service.priceGrandeFixed) throw new Error(`No hay precio fijo para Grande en ${service}`)
        return { price: Number(service.priceGrandeFixed), priceType: 'fixed', breakdown: `Precio fijo Grande: ${service.priceGrandeFixed}€` }
      }
      if (!service.priceGrandeHourly) throw new Error(`No hay tarifa horaria para Grande en ${service}`)
      const gh = Number(service.priceGrandeHourly)
      const ghHours = hours || 1
      return {
        price: gh * ghHours,
        priceType: 'hourly',
        hourlyRate: gh,
        totalHours: ghHours,
        breakdown: `${ghHours}h × ${gh}€/h = ${gh * ghHours}€`
      }

    case 'gigante':
      if (!service.priceGiganteHourly) throw new Error(`No hay tarifa horaria para Gigante en ${service}`)
      const gi = Number(service.priceGiganteHourly)
      const giHours = hours || 1
      return {
        price: gi * giHours,
        priceType: 'hourly',
        hourlyRate: gi,
        totalHours: giHours,
        breakdown: `${giHours}h × ${gi}€/h = ${gi * giHours}€`
      }
  }
}

export function formatCurrency(amount: number | string | null | undefined): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount || 0)
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num)
}
