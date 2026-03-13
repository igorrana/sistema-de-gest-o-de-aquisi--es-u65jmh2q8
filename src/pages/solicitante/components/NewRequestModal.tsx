import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import useAppStore from '@/stores/useAppStore'
import useAuthStore from '@/stores/useAuthStore'

export function NewRequestModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { addRequest } = useAppStore()
  const { currentUser } = useAuthStore()
  const [desc, setDesc] = useState('')
  const [type, setType] = useState<'Material' | 'Serviço' | ''>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!desc || !type || !currentUser) return toast.error('Preencha os campos obrigatórios')

    addRequest({
      description: desc,
      type: type as 'Material' | 'Serviço',
      status_id: 's1', // Rascunho default
      requester_id: currentUser.id,
      buyer_id: null,
      board: null,
    })

    toast.success('Nova solicitação criada com sucesso!')
    setDesc('')
    setType('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Solicitação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              Descrição <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Descreva o material ou serviço necessário..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label>
              Tipo <span className="text-red-500">*</span>
            </Label>
            <Select value={type} onValueChange={(v: any) => setType(v)} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Material">Material</SelectItem>
                <SelectItem value="Serviço">Serviço</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Rascunho</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
