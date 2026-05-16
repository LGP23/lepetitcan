import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER
const smsNumber = process.env.TWILIO_SMS_NUMBER

const client = accountSid && authToken ? twilio(accountSid, authToken) : null

export async function sendWhatsApp(to: string, body: string) {
  if (!client || !whatsappNumber) {
    console.warn('Twilio no configurado. WhatsApp no enviado:', body)
    return null
  }

  try {
    const message = await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      body,
      to: `whatsapp:${to}`,
    })
    return message.sid
  } catch (error) {
    console.error('Error enviando WhatsApp:', error)
    throw error
  }
}

export async function sendSMS(to: string, body: string) {
  if (!client || !smsNumber) {
    console.warn('Twilio no configurado. SMS no enviado:', body)
    return null
  }

  try {
    const message = await client.messages.create({
      from: smsNumber,
      body,
      to,
    })
    return message.sid
  } catch (error) {
    console.error('Error enviando SMS:', error)
    throw error
  }
}
