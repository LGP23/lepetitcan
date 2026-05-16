import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, addWeeks, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatDate(date: Date | string, pattern: string = 'PPP'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, pattern, { locale: es })
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'HH:mm', { locale: es })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'PPP HH:mm', { locale: es })
}

export function formatRelative(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isToday(d)) return `Hoy, ${formatTime(d)}`
  if (isTomorrow(d)) return `Mañana, ${formatTime(d)}`
  if (isYesterday(d)) return `Ayer, ${formatTime(d)}`
  return formatDate(d, "EEEE d 'de' MMMM, HH:mm")
}

export function formatPetAge(birthDate: Date | string): string {
  const d = typeof birthDate === 'string' ? new Date(birthDate) : birthDate
  const years = differenceInDays(new Date(), d) / 365
  if (years < 1) return `${Math.round(years * 12)} meses`
  return `${Math.floor(years)} años`
}

export function getSixWeeksAfter(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : date
  return addWeeks(d, 6)
}

export function getMondayOfWeek(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function getWeekDays(date: Date = new Date()): Date[] {
  const monday = getMondayOfWeek(date)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    return d
  })
}

export function generateTimeSlots(
  startHour: number = 9,
  endHour: number = 16,
  durationMin: number = 60,
  existingBookings: { start: Date; end: Date }[] = []
): { time: string; available: boolean }[] {
  const slots: { time: string; available: boolean }[] = []
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += durationMin) {
      const slotStart = new Date()
      slotStart.setHours(h, m, 0, 0)
      const slotEnd = new Date(slotStart)
      slotEnd.setMinutes(slotEnd.getMinutes() + durationMin)
      const isBooked = existingBookings.some(
        (b) => slotStart < b.end && slotEnd > b.start
      )
      slots.push({
        time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
        available: !isBooked,
      })
    }
  }
  return slots
}
