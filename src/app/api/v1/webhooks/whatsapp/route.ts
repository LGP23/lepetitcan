import { NextResponse } from 'next/server'
import { chat, handleFunctionCall } from '@/lib/integrations/openai'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const verifyToken = process.env.TWILIO_WHATSAPP_NUMBER
  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = body.Body || ''
    const from = body.From || ''

    const messages = [
      { role: 'user' as const, content: message },
    ]

    const response = await chat(messages)

    if (response.function_call) {
      const result = await handleFunctionCall(
        response.function_call.name,
        response.function_call.arguments
      )

      const followUp = await chat([
        ...messages,
        { role: 'assistant', content: JSON.stringify(result) },
      ])
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
