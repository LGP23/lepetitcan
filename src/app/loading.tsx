export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    </div>
  )
}
