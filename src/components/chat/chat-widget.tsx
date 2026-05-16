'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  actions?: { label: string; action: string }[]
}

const quickReplies = [
  '¿Cuál es el horario?',
  '¿Qué servicios ofrecéis?',
  '¿Cuánto cuesta un corte?',
  'Quiero reservar cita',
]

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy el asistente de Le Petit Can. ¿En qué puedo ayudarte? 🐾',
      actions: [
        { label: 'Reservar cita', action: 'booking' },
        { label: 'Ver servicios', action: 'services' },
        { label: 'Hablar con Lili', action: 'human' },
      ],
    },
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(text: string) {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      const responses: Record<string, string> = {
        'horario': 'Nuestro horario es de lunes a viernes de 09:30 a 16:00. Cerramos sábados, domingos y festivos.',
        'servicios': 'Ofrecemos: Corte de pelo, Baño completo, Desenredado, Corte de uñas, Limpieza de oídos, Cepillado dental y Baño Spa. ¿Te interesa alguno en especial?',
        'cuesta': 'Los precios varían según el tamaño de tu mascota. Toy/Pequeño/Mediano tienen precio fijo. Grandes y Gigantes pueden ser por hora. ¿De qué tamaño es tu perro?',
        'reservar': '¡Claro! Para reservar necesito algunos datos. Dime tu nombre y el de tu mascota y te ayudo con la cita.',
      }

      const lower = text.toLowerCase()
      let response = ''
      let actions: { label: string; action: string }[] | undefined

      if (lower.includes('horario')) {
        response = responses['horario']
      } else if (lower.includes('servicio')) {
        response = responses['servicios']
      } else if (lower.includes('cuanto') || lower.includes('precio') || lower.includes('cuesta') || lower.includes('tarifa') || lower.includes('cost')) {
        response = responses['cuesta']
      } else if (lower.includes('reserv') || lower.includes('cita') || lower.includes('agenda')) {
        response = responses['reservar']
        actions = [
          { label: 'Ir al formulario', action: 'booking_form' },
          { label: 'Hablar con Lili', action: 'human' },
        ]
      } else {
        response = 'No estoy seguro de haber entendido. Puedes preguntarme sobre horarios, servicios, precios o reservar una cita. ¿O prefieres hablar directamente con Lili?'
        actions = [{ label: 'Hablar con Lili', action: 'human' }]
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        actions,
      }
      setMessages((prev) => [...prev, assistantMsg])
    }, 800)
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-rose-400 hover:bg-rose-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-50"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-xl border z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-rose-50 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-400 rounded-full flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Le Petit Can</p>
                <p className="text-xs text-green-600">🟢 En línea</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-rose-200 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-rose-400 text-white' : 'bg-gray-100 text-gray-900'} rounded-2xl px-4 py-2.5`}>
                  <div className="flex items-center gap-2 mb-1">
                    {msg.role === 'assistant' ? (
                      <Bot size={14} className="text-rose-500" />
                    ) : (
                      <User size={14} className="text-white/80" />
                    )}
                    <span className="text-xs opacity-70">
                      {msg.role === 'assistant' ? 'Le Petit Can' : 'Tú'}
                    </span>
                  </div>
                  <p className="text-sm">{msg.content}</p>
                  {msg.actions && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.actions.map((action) => (
                        <button
                          key={action.action}
                          onClick={() => handleSend(action.label)}
                          className="text-xs px-2.5 py-1 rounded-lg border border-current hover:bg-white/20 transition-colors"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {quickReplies.map((qr) => (
                <button
                  key={qr}
                  onClick={() => handleSend(qr)}
                  className="text-xs px-2.5 py-1 bg-gray-50 hover:bg-rose-50 rounded-lg border transition-colors"
                >
                  {qr}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && input.trim() && handleSend(input.trim())}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <button
                onClick={() => input.trim() && handleSend(input.trim())}
                className="p-2 bg-rose-400 hover:bg-rose-500 text-white rounded-xl transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
