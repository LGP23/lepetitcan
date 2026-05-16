export const PET_SIZES = {
  toy: { label: 'Toy', icon: '🧸', description: 'Hasta 5 kg' },
  pequeno: { label: 'Pequeño', icon: '🐕', description: '5-10 kg' },
  mediano: { label: 'Mediano', icon: '🐕', description: '10-25 kg' },
  grande: { label: 'Grande', icon: '🐕‍🦺', description: '25-45 kg' },
  gigante: { label: 'Gigante', icon: '🦮', description: 'Más de 45 kg' },
} as const

export const APPOINTMENT_STATUS = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmada', color: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'En curso', color: 'bg-purple-100 text-purple-800' },
  completed: { label: 'Completada', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800' },
} as const

export const OWNER_SOURCES = {
  web: { label: 'Web' },
  whatsapp: { label: 'WhatsApp' },
  instagram: { label: 'Instagram' },
  facebook: { label: 'Facebook' },
  sms: { label: 'SMS' },
  phone: { label: 'Teléfono' },
  presencial: { label: 'Presencial' },
  ai_agent: { label: 'Agente IA' },
} as const

export const NOTIFICATION_CHANNELS = {
  whatsapp: { label: 'WhatsApp', icon: '📱' },
  email: { label: 'Email', icon: '📧' },
  sms: { label: 'SMS', icon: '💬' },
  instagram: { label: 'Instagram', icon: '📸' },
  facebook: { label: 'Facebook', icon: '👍' },
} as const

export const NOTIFICATION_TYPES = {
  appointment_confirmation: { label: 'Confirmación reserva', defaultEnabled: true },
  appointment_reminder: { label: 'Recordatorio cita', defaultEnabled: true },
  appointment_cancellation: { label: 'Anulación reserva', defaultEnabled: true },
  appointment_modification: { label: 'Modificación cita', defaultEnabled: true },
  pickup_reminder: { label: 'Mascota lista recoger', defaultEnabled: true },
  two_days_before: { label: 'Faltan 2 días', defaultEnabled: true },
  one_day_before: { label: 'Falta 1 día', defaultEnabled: true },
  two_hours_before: { label: 'Faltan 2 horas', defaultEnabled: true },
  six_weeks_followup: { label: '6 semanas post-servicio', defaultEnabled: true },
  birthday: { label: 'Cumpleaños mascota', defaultEnabled: true },
  review_request: { label: 'Pedir reseña', defaultEnabled: true },
} as const

export const PAYMENT_METHODS = {
  cash: { label: 'Efectivo', icon: '💰' },
  card: { label: 'Tarjeta', icon: '💳' },
  bizum: { label: 'Bizum', icon: '📱' },
} as const

export const PIPELINE_STEPS = [
  { step: 'arrived', label: 'Llegó', icon: '✅' },
  { step: 'bath', label: 'Baño', icon: '🛁' },
  { step: 'cut', label: 'Corte', icon: '✂️' },
  { step: 'drying', label: 'Secado', icon: '💨' },
  { step: 'ready', label: 'Listo', icon: '🏁' },
] as const

export const ROLES = {
  admin: { label: 'Administrador' },
  peluquero: { label: 'Peluquero' },
  cliente: { label: 'Cliente' },
} as const
