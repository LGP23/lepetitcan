import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50">
      <div className="text-center">
        <h1 className="font-serif text-6xl text-rose-400 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">Página no encontrada</p>
        <Link href="/dashboard" className="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2.5 rounded-xl transition-colors">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
