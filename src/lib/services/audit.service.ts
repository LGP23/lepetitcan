import { prisma } from '@/lib/db'

export async function logAudit(options: {
  userId: string
  action: string
  entityType: string
  entityId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}) {
  return prisma.auditLog.create({ data: options })
}
