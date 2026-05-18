'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { toast } from 'sonner'

interface Props {
  clientId: string
  clientName: string
}

export function DeleteClientButton({ clientId, clientName }: Props) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/v1/clients/${clientId}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || 'Error al eliminar')
      }
      toast.success('Cliente eliminado correctamente')
      router.push('/clientes')
    } catch {
      toast.error('Error al eliminar el cliente')
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button variant="destructive" size="sm" onClick={() => setShowConfirm(true)}>
          <Trash2 size={16} className="mr-1" /> Eliminar cliente
        </Button>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar cliente"
        message={`¿Estás seguro de que quieres eliminar a ${clientName}? Esta acción no se puede deshacer.`}
        isLoading={isDeleting}
      />
    </>
  )
}
