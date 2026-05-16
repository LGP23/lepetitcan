import Link from 'next/link'
import { UserNav } from '@/components/layouts/user-nav'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/mis-citas" className="font-serif text-lg font-semibold text-rose-500">
            Le Petit Can
          </Link>
          <UserNav />
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
