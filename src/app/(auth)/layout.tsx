export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-rose-600">Le Petit Can</h1>
          <p className="text-muted-foreground text-sm mt-1">Salón Boutique de Estética Canina</p>
        </div>
        {children}
      </div>
    </div>
  )
}
