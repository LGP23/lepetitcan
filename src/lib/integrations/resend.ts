import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY
const resend = apiKey ? new Resend(apiKey) : null

interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  if (!resend) {
    console.warn('Resend no configurado. Email no enviado:', subject)
    return null
  }

  try {
    const data = await resend.emails.send({
      from: from || 'Le Petit Can <no-reply@lepetitcan.es>',
      to,
      subject,
      html,
    })
    return data.id
  } catch (error) {
    console.error('Error enviando email:', error)
    throw error
  }
}

export function buildEmailTemplate(title: string, body: string, cta?: { label: string; url: string }) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: system-ui, sans-serif; background: #FFF8F3; padding: 32px;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-family: Georgia, serif; color: #E8A0B4; font-size: 24px; margin: 0;">Le Petit Can</h1>
          <p style="color: #8B7355; font-size: 12px;">Salón Boutique de Estética Canina</p>
        </div>
        <h2 style="font-size: 18px; color: #1a1a1a; margin: 0 0 12px 0;">${title}</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #4a4a4a;">${body}</p>
        ${cta ? `
          <div style="text-align: center; margin: 24px 0;">
            <a href="${cta.url}" style="display: inline-block; background: #E8A0B4; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-size: 14px; font-weight: 500;">
              ${cta.label}
            </a>
          </div>
        ` : ''}
        <div style="border-top: 1px solid #f0f0f0; margin-top: 24px; padding-top: 16px; font-size: 11px; color: #8B7355; text-align: center;">
          <p>Rúa Francisco Pizarro, 11 · 15570 Narón · A Coruña</p>
          <p>${new Date().getFullYear()} Le Petit Can. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
