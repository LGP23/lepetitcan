'use client'

import { useState } from 'react'
import { Bell, Smartphone, Mail, MessageSquare, Instagram, Facebook } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NOTIFICATION_TYPES, NOTIFICATION_CHANNELS } from '@/lib/types/enums'

const defaultConfig = Object.entries(NOTIFICATION_TYPES).map(([type, config]) => ({
  type,
  label: config.label,
  enabled: config.defaultEnabled,
  channels: Object.keys(NOTIFICATION_CHANNELS).reduce((acc, ch) => {
    acc[ch] = ch === 'whatsapp'
    return acc
  }, {} as Record<string, boolean>),
}))

const channelIcons: Record<string, any> = {
  whatsapp: Smartphone,
  email: Mail,
  sms: MessageSquare,
  instagram: Instagram,
  facebook: Facebook,
}

export default function NotificationsPage() {
  const [config, setConfig] = useState(defaultConfig)

  function toggleEnabled(type: string) {
    setConfig(config.map((c) => c.type === type ? { ...c, enabled: !c.enabled } : c))
  }

  function toggleChannel(type: string, channel: string) {
    setConfig(config.map((c) =>
      c.type === type
        ? { ...c, channels: { ...c.channels, [channel]: !c.channels[channel] } }
        : c
    ))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Automatizaciones</h1>
        <p className="text-sm text-muted-foreground mt-1">Configura los avisos automáticos a clientes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell size={18} className="text-rose-500" />
            Avisos al cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.map((item) => (
            <div key={item.type} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">{item.label}</label>
                  <button
                    onClick={() => toggleEnabled(item.type)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      item.enabled ? 'bg-rose-400' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      item.enabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {item.enabled && (
                  <div className="flex items-center gap-2 mt-2">
                    {Object.entries(channelIcons).map(([ch, Icon]) => (
                      <button
                        key={ch}
                        onClick={() => toggleChannel(item.type, ch)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          item.channels[ch]
                            ? 'bg-rose-50 border-rose-200 text-rose-600'
                            : 'bg-white border-gray-200 text-gray-300'
                        }`}
                        title={NOTIFICATION_CHANNELS[ch as keyof typeof NOTIFICATION_CHANNELS].label}
                      >
                        <Icon size={16} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="text-center">
        <button className="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
          Guardar configuración
        </button>
      </div>
    </div>
  )
}
