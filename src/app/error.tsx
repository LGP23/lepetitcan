'use client'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Algo salió mal</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
        </p>
        <button
          onClick={reset}
          className="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2.5 rounded-xl transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}
