import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const staffRoutes = ['/dashboard', '/clientes', '/mascotas', '/servicios', '/calendario', '/citas', '/tickets', '/facturas', '/productos', '/notificaciones', '/equipo', '/configuracion', '/auditoria']
const clientRoutes = ['/mis-datos', '/mis-mascotas', '/citas', '/historial', '/facturas', '/notificaciones']
const authRoutes = ['/login', '/register', '/recuperar-password']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role

  if (authRoutes.some((r) => pathname.startsWith(r))) {
    if (isLoggedIn) {
      if (role === 'admin' || role === 'peluquero') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return NextResponse.redirect(new URL('/mis-citas', req.url))
    }
    return NextResponse.next()
  }

  const isStaffRoute = staffRoutes.some((r) => pathname.startsWith(r))
  const isClientRoute = clientRoutes.some((r) => pathname.startsWith(r))

  if (!isLoggedIn && (isStaffRoute || isClientRoute)) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isStaffRoute && role === 'cliente') {
    return NextResponse.redirect(new URL('/mis-citas', req.url))
  }

  if (isClientRoute && (role === 'admin' || role === 'peluquero')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons|.*\\.png$).*)'],
}
