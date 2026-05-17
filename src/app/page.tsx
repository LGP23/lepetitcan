'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    if (session.user.role === 'admin' || session.user.role === 'peluquero') {
      router.push('/dashboard')
    } else {
      router.push('/citas')
    }
  }, [session, status, router])

  // Timeout: if session doesn't load in 3s, redirect to login
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login')
    }, 3000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50">
      <div className="text-center">
        <h1 className="font-serif text-3xl text-rose-500">Le Petit Can</h1>
        <p className="text-muted-foreground mt-2">Cargando...</p>
      </div>
    </div>
  )
}
