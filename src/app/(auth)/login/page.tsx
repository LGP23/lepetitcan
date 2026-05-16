'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [show2FA, setShow2FA] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        twoFactorCode: show2FA ? twoFactorCode : undefined,
        redirect: false,
      })

      if (result?.error === '2FA_REQUIRED') {
        setShow2FA(true)
        setLoading(false)
        return
      }

      if (result?.error) {
        setError('Credenciales inválidas')
        setLoading(false)
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError('Error al iniciar sesión')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border p-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Iniciar sesión</h2>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
            placeholder="tu@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
            placeholder="••••••••"
            required
          />
        </div>

        {show2FA && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código de verificación (2FA)
            </label>
            <input
              type="text"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-400 hover:bg-rose-500 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? 'Entrando...' : show2FA ? 'Verificar' : 'Entrar'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-rose-500 hover:text-rose-600 font-medium">
          Registrarse
        </Link>
      </div>

      <div className="mt-4 text-center">
        <Link href="/recuperar-password" className="text-xs text-muted-foreground hover:text-rose-500">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </div>
  )
}
