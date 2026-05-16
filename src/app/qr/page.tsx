'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function QRPage() {
  const { data: session } = useSession()
  const [appUrl, setAppUrl] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')

  useEffect(() => {
    const url = window.location.origin
    setAppUrl(url)

    const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`
    setQrDataUrl(qrApi)
  }, [])

  if (session?.user?.role === 'cliente') {
    return <div className="min-h-screen flex items-center justify-center">No autorizado</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg border p-8 text-center max-w-sm w-full">
        <h1 className="font-serif text-2xl text-rose-500 mb-2">Le Petit Can</h1>
        <p className="text-sm text-muted-foreground mb-6">Escanea para abrir la app en tu móvil</p>

        {qrDataUrl && (
          <div className="bg-white p-4 rounded-xl border inline-block mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="QR Code"
              className="w-48 h-48 mx-auto"
            />
          </div>
        )}

        <p className="text-xs text-muted-foreground mb-2 break-all">{appUrl}</p>

        <div className="space-y-2 text-xs text-left bg-gray-50 rounded-xl p-4">
          <p className="font-medium text-gray-700">📱 Cómo usar:</p>
          <ol className="space-y-1 text-muted-foreground list-decimal list-inside">
            <li>Asegúrate de que el PC y el móvil estén en la misma red WiFi</li>
            <li>En el PC: <code className="bg-gray-200 px-1 rounded">npm run dev</code></li>
            <li>Escanea el código QR con tu móvil</li>
            <li>O escribe la URL en el navegador del móvil</li>
            <li>En Safari/Chrome: Compartir → Añadir a pantalla de inicio</li>
          </ol>
        </div>

        <div className="mt-4 space-y-2 text-xs text-left bg-rose-50 rounded-xl p-4">
          <p className="font-medium text-rose-700">🐾 Expo Go (opcional)</p>
          <ol className="space-y-1 text-rose-600 list-decimal list-inside">
            <li>Instala Expo Go en tu móvil</li>
            <li>En PC: <code className="bg-rose-200 px-1 rounded">cd expo-app && npx expo start</code></li>
            <li>Escanea el QR de Expo Go</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
