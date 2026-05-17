import { NextResponse } from 'next/server'
import { handleCallback } from '@/lib/integrations/google-calendar'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') // userId

  if (!code || !state) {
    return NextResponse.redirect(new URL('/configuracion?error=missing_params', request.url))
  }

  try {
    await handleCallback(code, state)
    return NextResponse.redirect(new URL('/configuracion?calendar=connected', request.url))
  } catch (error) {
    console.error('Error en callback Google Calendar:', error)
    return NextResponse.redirect(new URL('/configuracion?error=calendar_failed', request.url))
  }
}
