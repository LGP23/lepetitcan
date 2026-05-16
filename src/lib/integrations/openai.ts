import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY
const openai = apiKey ? new OpenAI({ apiKey }) : null

const SYSTEM_PROMPT = `
Eres el asistente virtual de Le Petit Can, un salón boutique de estética canina en Narón (A Coruña).

INFORMACIÓN DEL NEGOCIO:
- Horario: Lunes a Viernes 09:30 - 16:00
- Dirección: Rúa Francisco Pizarro, 11, 15570 Narón
- Teléfono: +34 698 13 07 77
- Email: lepetitcan.naron@gmail.com
- Instagram: @lepetitcan.naron

SERVICIOS Y PRECIOS (orientativos):
- Corte de pelo: Toy 30€, Pequeño 35€, Mediano 40€, Grande 50€ fijo o 35€/h, Gigante 45€/h
- Baño completo: Toy 20€, Pequeño 25€, Mediano 30€, Grande 40€, Gigante 50€/h
- Desenredado: 30€/h todas las tallas
- Corte de uñas: Toy 10€, Pequeño/Mediano 12€, Grande 15€, Gigante 18€/h
- Limpieza de oídos: 10-15€ según talla
- Cepillado dental: 10-18€ según talla
- Baño Spa: Toy 45€, Pequeño 50€, Mediano 60€, Grande 80€, Gigante 60€/h

INSTRUCCIONES:
- Sé amable y cercano, usando un tono cálido.
- Si el usuario quiere reservar, cancelar o modificar una cita, guíalo paso a paso.
- Si no puedes resolver algo, ofrece hablar con Lili (la dueña).
- Responde siempre en español.
- Usa emojis de forma moderada para ser cercano.
`

const functions: OpenAI.Chat.CompletionCreateParams.Function[] = [
  {
    name: 'get_availability',
    description: 'Obtiene los horarios disponibles para una fecha',
    parameters: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Fecha en formato YYYY-MM-DD' },
      },
      required: ['date'],
    },
  },
  {
    name: 'create_appointment',
    description: 'Crea una nueva cita',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        petName: { type: 'string' },
        service: { type: 'string' },
        date: { type: 'string' },
        time: { type: 'string' },
      },
      required: ['name', 'phone', 'petName', 'service', 'date', 'time'],
    },
  },
  {
    name: 'cancel_appointment',
    description: 'Cancela una cita existente',
    parameters: {
      type: 'object',
      properties: {
        appointmentId: { type: 'string' },
        reason: { type: 'string' },
      },
      required: ['appointmentId'],
    },
  },
]

export async function chat(messages: { role: 'user' | 'assistant'; content: string }[]) {
  if (!openai) {
    return { role: 'assistant', content: 'Lo siento, el asistente no está disponible en este momento.' }
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      functions,
      function_call: 'auto',
      temperature: 0.7,
      max_tokens: 500,
    })

    const message = response.choices[0].message

    if (message.function_call) {
      return {
        role: 'assistant',
        content: null,
        function_call: {
          name: message.function_call.name,
          arguments: message.function_call.arguments,
        },
      }
    }

    return {
      role: 'assistant',
      content: message.content,
    }
  } catch (error) {
    console.error('Error en OpenAI:', error)
    return {
      role: 'assistant',
      content: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.',
    }
  }
}

export async function handleFunctionCall(name: string, args: string) {
  const params = JSON.parse(args)

  switch (name) {
    case 'get_availability': {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/appointments/check-availability?date=${params.date}&staffId=all&duration=60`
      )
      const data = await res.json()
      return data
    }

    case 'create_appointment': {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/appointments/public-booking`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        }
      )
      return res.json()
    }

    case 'cancel_appointment': {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/appointments/${params.appointmentId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'cancelled', cancellationReason: params.reason }),
        }
      )
      return res.json()
    }

    default:
      return { error: 'Función desconocida' }
  }
}
