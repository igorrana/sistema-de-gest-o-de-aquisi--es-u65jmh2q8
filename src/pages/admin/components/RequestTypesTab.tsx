import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Edit2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { RequestType } from '@/types'

export function RequestTypesTab() {
  const { requestTypes, users, addRequestType, updateRequestType } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<RequestType>>({})

  const buyers = users.filter((u) => u.roles.includes('comprador') && u.active)

  const handleOpenNew = () => {
    setEditingId(null)
    setFormData({ name: '', description: '', default_buyer_id: null, is_active: true })
    setIsOpen(true)
  }

  const handleOpenEdit = (rt: RequestType) => {
    setEditingId(rt.id)
    setFormData({ ...rt })
    setIsOpen(true)
  }

  const handleSave = () => {
    if (!formData.name?.trim()) {
      toast.error('O nome do tipo de solicitação é obrigatório.')
      return
    }

    if (editingId) {
      updateRequestType(editingId, formData)
      toast.success('Tipo de solicitação atualizado com sucesso!')
    } else {
      addRequestType(formData)
      toast.success('Novo tipo de solicitação criado com sucesso!')
    }
    setIsOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tipos de Solicitação</h3>
        <Button size="sm" onClick={handleOpenNew}>
          <Plus className="w-4 h-4 mr-2" /> Novo Tipo
        </Button>
      </div>
      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[200px]">Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[200px]">Comprador Padrão</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[80px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requestTypes.map((rt) => {
              const buyer = users.find((u) => u.id === rt.default_buyer_id)
              return (
                <TableRow key={rt.id}>
                  <TableCell className="font-medium">{rt.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{rt.description}</TableCell>
                  <TableCell>
                    {buyer?.name || <span className="text-muted-foreground italic">Nenhum</span>}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={rt.is_active ? 'default' : 'secondary'}
                      className={rt.is_active ? 'bg-emerald-500' : ''}
                    >
                      {rt.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(rt)}>
                      <Edit2 className="w-4 h-4 text-slate-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar Tipo de Solicitação' : 'Novo Tipo de Solicitação'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Contratação de Serviços"
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Breve descrição sobre a utilidade deste tipo..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Comprador Padrão</Label>
              <Select
                value={formData.default_buyer_id || 'none'}
                onValueChange={(v) =>
                  setFormData({ ...formData, default_buyer_id: v === 'none' ? null : v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um comprador..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum comprador padrão</SelectItem>
                  {buyers.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[13px] text-muted-foreground pt-1">
                Novas solicitações criadas sob este tipo serão roteadas automaticamente para este
                comprador.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
