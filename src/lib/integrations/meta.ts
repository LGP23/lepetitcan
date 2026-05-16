export async function verifyWebhook(mode: string, token: string, challenge: string) {
  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN

  if (mode === 'subscribe' && token === verifyToken) {
    return challenge
  }
  return null
}

export async function sendMessage(recipientId: string, message: string, platform: 'instagram' | 'facebook') {
  const token = process.env.META_PAGE_ID
  if (!token) {
    console.warn('Meta no configurado')
    return null
  }

  try {
    const apiVersion = 'v20.0'
    const pageId = process.env.META_PAGE_ID

    const url = platform === 'instagram'
      ? `https://graph.facebook.com/${apiVersion}/me/messages`
      : `https://graph.facebook.com/${apiVersion}/${pageId}/messages`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message },
        messaging_type: 'RESPONSE',
      }),
    })

    return response.json()
  } catch (error) {
    console.error('Error enviando mensaje Meta:', error)
    return null
  }
}

export function processWebhookEvent(entry: any) {
  const events: { senderId: string; message: string; platform: 'instagram' | 'facebook' }[] = []

  for (const entryItem of entry) {
    for (const messaging of entryItem.messaging || []) {
      if (messaging.message?.text && messaging.sender?.id) {
        events.push({
          senderId: messaging.sender.id,
          message: messaging.message.text,
          platform: entryItem.id?.startsWith('instagram') ? 'instagram' : 'facebook',
        })
      }
    }
  }

  return events
}
