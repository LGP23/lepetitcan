import { handlers } from '@/lib/auth'

// Force Node.js runtime (Prisma needs it)
export const runtime = 'nodejs'

// NextAuth.js v5 handlers
export const GET = handlers.GET
export const POST = handlers.POST
