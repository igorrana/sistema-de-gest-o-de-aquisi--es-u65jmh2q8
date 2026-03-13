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

export function ClaimRequestModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { requests, updateRequest, users } = useAppStore()
  const { currentUser } = useAuthStore()
  const [reqNumber, setReqNumber] = useState('')
  const [assigneeId, setAssigneeId] = useState<string>('me')

  const activeBuyers = users.filter((u) => u.role === 'comprador' && u.active)

  const handleClaim = () => {
    if (!reqNumber) return toast.error('Informe o número da solicitação')
    const req = requests.find((r) => r.request_number === reqNumber)

    if (!req) return toast.error('Solicitação não encontrada')
    if (req.buyer_id) return toast.warning('Esta solicitação já possui um comprador atribuído')

    const finalBuyerId = assigneeId === 'me' ? currentUser?.id : assigneeId
    updateRequest(req.id, { buyer_id: finalBuyerId, status_id: 's3' })
    toast.success('Solicitação resgatada com sucesso!')
    setReqNumber('')
    setAssigneeId('me')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resgatar Solicitação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Número da Solicitação (ERP)</Label>
            <Input
              value={reqNumber}
              onChange={(e) => setReqNumber(e.target.value)}
              placeholder="ex: REQ-001"
            />
          </div>
          <div className="space-y-2">
            <Label>Atribuir para</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="me">Para Mim</SelectItem>
                {activeBuyers
                  .filter((b) => b.id !== currentUser?.id)
                  .map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleClaim}>Confirmar Resgate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
