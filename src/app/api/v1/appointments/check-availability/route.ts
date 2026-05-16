import { NextResponse } from 'next/server'
import { getAvailableSlots } from '@/lib/services/appointment.service'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: { message: 'No autorizado' } }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const staffId = searchParams.get('staffId')
  const duration = parseInt(searchParams.get('duration') || '60')

  if (!date || !staffId) {
    return NextResponse.json(
      { error: { message: 'Fecha y staffId requeridos' } },
      { status: 400 }
    )
  }

  const slots = await getAvailableSlots(date, staffId, duration)
  return NextResponse.json({ data: slots })
}
