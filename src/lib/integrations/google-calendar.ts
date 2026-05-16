import { google } from 'googleapis'
import { prisma } from '@/lib/db'

const SCOPES = ['https://www.googleapis.com/auth/calendar.events']

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
}

export function getAuthUrl(userId: string): string {
  const oauth2Client = getOAuth2Client()
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state: userId,
    prompt: 'consent',
  })
}

export async function handleCallback(code: string, userId: string) {
  const oauth2Client = getOAuth2Client()
  const { tokens } = await oauth2Client.getToken(code)

  await prisma.googleCalendarToken.upsert({
    where: { userId },
    update: {
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      expiryDate: new Date(tokens.expiry_date!),
    },
    create: {
      userId,
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      expiryDate: new Date(tokens.expiry_date!),
    },
  })

  return tokens
}

async function getAuthenticatedClient(userId: string) {
  const token = await prisma.googleCalendarToken.findUnique({ where: { userId } })
  if (!token) throw new Error('Google Calendar no conectado')

  const oauth2Client = getOAuth2Client()
  oauth2Client.setCredentials({
    access_token: token.accessToken,
    refresh_token: token.refreshToken,
    expiry_date: token.expiryDate.getTime(),
  })

  oauth2Client.on('tokens', async (newTokens) => {
    await prisma.googleCalendarToken.update({
      where: { userId },
      data: {
        accessToken: newTokens.access_token || token.accessToken,
        refreshToken: newTokens.refresh_token || token.refreshToken,
        expiryDate: new Date(newTokens.expiry_date || token.expiryDate),
      },
    })
  })

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

export async function createEvent(
  userId: string,
  appointment: { id: string; title: string; description: string; start: Date; end: Date }
) {
  const calendar = await getAuthenticatedClient(userId)

  const event = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: appointment.title,
      description: appointment.description,
      start: { dateTime: appointment.start.toISOString(), timeZone: 'Europe/Madrid' },
      end: { dateTime: appointment.end.toISOString(), timeZone: 'Europe/Madrid' },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 60 },
          { method: 'email', minutes: 1440 },
        ],
      },
    },
  })

  if (event.data.id) {
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { googleEventId: event.data.id },
    })
  }

  return event.data
}

export async function updateEvent(
  userId: string,
  eventId: string,
  appointment: { title: string; description: string; start: Date; end: Date }
) {
  const calendar = await getAuthenticatedClient(userId)

  await calendar.events.update({
    calendarId: 'primary',
    eventId,
    requestBody: {
      summary: appointment.title,
      description: appointment.description,
      start: { dateTime: appointment.start.toISOString(), timeZone: 'Europe/Madrid' },
      end: { dateTime: appointment.end.toISOString(), timeZone: 'Europe/Madrid' },
    },
  })
}

export async function deleteEvent(userId: string, eventId: string) {
  const calendar = await getAuthenticatedClient(userId)
  await calendar.events.delete({ calendarId: 'primary', eventId })
}

export async function syncEvents(userId: string) {
  const calendar = await getAuthenticatedClient(userId)

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 100,
    singleEvents: true,
    orderBy: 'startTime',
  })

  const events = response.data.items || []
  return events.map((event) => ({
    googleId: event.id,
    summary: event.summary,
    start: event.start?.dateTime || event.start?.date,
    end: event.end?.dateTime || event.end?.date,
  }))
}
