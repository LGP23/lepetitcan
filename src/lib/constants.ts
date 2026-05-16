export const BUSINESS_HOURS = {
  start: 9,
  end: 16,
  days: [1, 2, 3, 4, 5],
  daysLabels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
}

export const APP_NAME = 'Le Petit Can'
export const APP_DESCRIPTION = 'Salón Boutique de Estética Canina'
export const APP_EMAIL = 'lepetitcan.naron@gmail.com'
export const APP_PHONE = '+34698130777'
export const APP_ADDRESS = 'Rúa Francisco Pizarro, 11, 15570 Narón, A Coruña'

export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 100,
}

export const RATE_LIMIT = {
  maxRequests: 10,
  windowSeconds: 60,
}

export const DATA_RETENTION = {
  ownerYears: 5,
  invoiceYears: 6,
  fiscalYears: 4,
  consentYears: 5,
  logMonths: 24,
  photoYears: 1,
}

export const INVOICE_FORMAT = {
  prefix: 'F',
  year: new Date().getFullYear(),
  padding: 5,
}

export const TICKET_FORMAT = {
  prefix: 'T',
  padding: 6,
}

export const REMINDER_INTERVALS = {
  twoDays: { days: 2, type: 'two_days_before' as const },
  oneDay: { days: 1, type: 'one_day_before' as const },
  twoHours: { hours: 2, type: 'two_hours_before' as const },
  sixWeeks: { days: 42, type: 'six_weeks_followup' as const },
  review: { hours: 1, type: 'review_request' as const },
}
