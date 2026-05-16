import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { prisma } from './db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
        twoFactorCode: { label: 'Código 2FA', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.passwordHash || !user.isActive) return null

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) return null

        if (user.twoFactorEnabled) {
          const code = credentials.twoFactorCode as string
          if (!code) throw new Error('2FA_REQUIRED')
          const { authenticator } = await import('otplib')
          const isValid2FA = authenticator.check(code, user.twoFactorSecret!)
          if (!isValid2FA) return null
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          twoFactorEnabled: user.twoFactorEnabled,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.twoFactorEnabled = (user as any).twoFactorEnabled
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean
      }
      return session
    },
  },
})

declare module 'next-auth' {
  interface User {
    role?: string
    twoFactorEnabled?: boolean
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      twoFactorEnabled: boolean
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    twoFactorEnabled: boolean
  }
}
