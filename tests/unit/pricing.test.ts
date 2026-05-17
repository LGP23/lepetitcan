import { describe, it, expect } from 'vitest'
import { calculatePrice } from '../src/lib/utils/pricing'

const service = {
  pricingModel: 'fixed',
  priceToy: 30,
  pricePequeno: 35,
  priceMediano: 40,
  priceGrandeFixed: 50,
  priceGrandeHourly: 35,
  priceGiganteHourly: 45,
} as any

describe('Pricing Engine', () => {
  it('calcula precio fijo para Toy', () => {
    const result = calculatePrice({ size: 'toy', service })
    expect(result.price).toBe(30)
    expect(result.priceType).toBe('fixed')
  })

  it('calcula precio fijo para Pequeño', () => {
    const result = calculatePrice({ size: 'pequeno', service })
    expect(result.price).toBe(35)
    expect(result.priceType).toBe('fixed')
  })

  it('calcula precio fijo para Mediano', () => {
    const result = calculatePrice({ size: 'mediano', service })
    expect(result.price).toBe(40)
    expect(result.priceType).toBe('fixed')
  })

  it('calcula precio fijo para Grande si el modelo es fixed', () => {
    const result = calculatePrice({ size: 'grande', service })
    expect(result.price).toBe(50)
    expect(result.priceType).toBe('fixed')
  })

  it('calcula precio por horas para Grande si el modelo es hourly', () => {
    const hourlyService = { ...service, pricingModel: 'hourly', priceGrandeHourly: 35 }
    const result = calculatePrice({ size: 'grande', service: hourlyService, hours: 2 })
    expect(result.price).toBe(70)
    expect(result.priceType).toBe('hourly')
    expect(result.totalHours).toBe(2)
  })

  it('calcula precio por horas para Gigante', () => {
    const result = calculatePrice({ size: 'gigante', service, hours: 1.5 })
    expect(result.price).toBe(67.5)
    expect(result.priceType).toBe('hourly')
  })

  it('lanza error si no hay precio para Toy', () => {
    const noToyService = { ...service, priceToy: null }
    expect(() => calculatePrice({ size: 'toy', service: noToyService })).toThrow()
  })
})
