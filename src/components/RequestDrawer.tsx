import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import useAppStore from '@/stores/useAppStore'
import useAuthStore from '@/stores/useAuthStore'
import { PurchaseRequest } from '@/types'
import { Badge } from '@/components/ui/badge'

interface RequestDrawerProps {
  requestId: string | null
  onClose: () => void
}

export function RequestDrawer({ requestId, onClose }: RequestDrawerProps) {
  const { requests, permissions, updateRequest, statuses, users, logs } = useAppStore()
  const { currentUser } = useAuthStore()
  const [formData, setFormData] = useState<Partial<PurchaseRequest>>({})

  const req = requests.find((r) => r.id === requestId)

  useEffect(() => {
    if (req) setFormData(req)
  }, [req])

  if (!req || !currentUser) return null

  const rolePerms = permissions[currentUser.current_role]
  const canEdit = (field: keyof typeof rolePerms) => rolePerms[field] === 'edit'
  const requestLogs = logs
    .filter((l) => l.request_id === req.id)
    .sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime())

  const handleSave = () => {
    // Comprador Logic: Mandatory Delivery Date on Pedido Realizado
    if (currentUser.current_role === 'comprador') {
      const isCompletingOrder =
        formData.status_id === 's4' ||
        (formData.order_number && formData.order_number !== req.order_number)
      if (isCompletingOrder && !formData.delivery_date) {
        return toast.error('Data de Entrega é obrigatória ao realizar o pedido.')
      }
    }

    const isOrderNumberAddedOrChanged =
      formData.order_number &&
      String(formData.order_number).trim() !== '' &&
      formData.order_number !== req.order_number

    const willUpdateStatus =
      isOrderNumberAddedOrChanged && req.status_id !== 's4' && formData.status_id !== 's4'

    updateRequest(req.id, formData)

    if (willUpdateStatus) {
      toast.success('Número do pedido salvo e status atualizado para Pedido Realizado')
    } else {
      toast.success('Solicitação atualizada com sucesso')
    }
    onClose()
  }

  return (
    <Sheet open={!!requestId} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col gap-0 p-0 border-l-0 shadow-2xl">
        <SheetHeader className="p-6 border-b bg-slate-50 shrink-0">
          <div className="flex justify-between items-center pr-6">
            <SheetTitle className="text-xl text-primary">
              Solicitação {formData.request_number || 'S/N'}
            </SheetTitle>
            <Badge variant="outline" className="text-xs bg-white">
              {formData.priority}
            </Badge>
          </div>
        </SheetHeader>
        <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-4 shrink-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="details" className="flex-1 overflow-y-auto p-6 m-0">
            <div className="grid gap-5">
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={!canEdit('description')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    disabled={!canEdit('type')}
                    value={formData.type}
                    onValueChange={(v) => setFormData({ ...formData, type: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Material">Material</SelectItem>
                      <SelectItem value="Serviço">Serviço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    disabled={!canEdit('status_id')}
                    value={formData.status_id}
                    onValueChange={(v) => setFormData({ ...formData, status_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status..." />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses
                        .filter((s) => s.active)
                        .map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Comprador Atribuído</Label>
                  <Select
                    disabled={!canEdit('buyer_id')}
                    value={formData.buyer_id || 'unassigned'}
                    onValueChange={(v) =>
                      setFormData({ ...formData, buyer_id: v === 'unassigned' ? null : v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhum..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Nenhum</SelectItem>
                      {users
                        .filter((u) => u.roles.includes('comprador') && u.active)
                        .map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Número da Solicitação (ERP)</Label>
                  <Input
                    value={formData.request_number || ''}
                    onChange={(e) => setFormData({ ...formData, request_number: e.target.value })}
                    disabled={!canEdit('request_number')}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Necessidade</Label>
                  <Input
                    type="date"
                    value={formData.need_date || ''}
                    onChange={(e) => setFormData({ ...formData, need_date: e.target.value })}
                    disabled={!canEdit('need_date')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Data de Entrega Prometida{' '}
                    {currentUser.current_role === 'comprador' && (
                      <span className="text-red-500">*</span>
                    )}
                  </Label>
                  <Input
                    type="date"
                    value={formData.delivery_date || ''}
                    onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                    disabled={!canEdit('delivery_date')}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Área/Board</Label>
                  <Input
                    value={formData.board || ''}
                    onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                    disabled={!canEdit('board')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Número do Pedido</Label>
                  <Input
                    value={formData.order_number || ''}
                    onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                    disabled={!canEdit('order_number')}
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar Alterações</Button>
            </div>
          </TabsContent>
          <TabsContent value="history" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full p-6">
              {requestLogs.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center">
                  Nenhum histórico encontrado.
                </p>
              ) : (
                <div className="space-y-4 border-l-2 border-slate-200 ml-3 pl-4">
                  {requestLogs.map((log) => (
                    <div key={log.id} className="relative">
                      <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-white" />
                      <p className="text-sm font-medium">{log.changed_by}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.changed_at).toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm mt-1 bg-slate-50 p-2 rounded border border-slate-100">
                        Alterou <span className="font-semibold">{log.field}</span> de{' '}
                        <span className="line-through opacity-70">{log.old_value || 'vazio'}</span>{' '}
                        para{' '}
                        <span className="font-semibold text-primary">
                          {log.new_value || 'vazio'}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
