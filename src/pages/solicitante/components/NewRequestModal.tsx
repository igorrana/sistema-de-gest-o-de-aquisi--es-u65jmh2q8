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
  const { addRequest, projects, requestTypes } = useAppStore()
  const { currentUser } = useAuthStore()

  const [desc, setDesc] = useState('')
  const [type, setType] = useState<'Material' | 'Serviço' | ''>('')
  const [projectId, setProjectId] = useState('')
  const [reqTypeId, setReqTypeId] = useState('')
  const [priority, setPriority] = useState<'P0' | 'P1' | 'P2'>('P2')
  const [needDate, setNeedDate] = useState('')

  const activeProjects = projects.filter((p) => p.is_active)
  const activeReqTypes = requestTypes.filter((rt) => rt.is_active)

  const handleSave = (statusId: string) => {
    if (!desc || !type || !projectId || !reqTypeId || !priority || !needDate || !currentUser) {
      return toast.error('Preencha todos os campos obrigatórios')
    }

    const today = new Date().toISOString().split('T')[0]
    if (needDate < today) {
      return toast.error('A Data de Necessidade deve ser no futuro')
    }

    const reqType = requestTypes.find((rt) => rt.id === reqTypeId)

    addRequest({
      description: desc,
      type: type as 'Material' | 'Serviço',
      project_id: projectId,
      request_type_id: reqTypeId,
      priority,
      need_date: needDate,
      status_id: statusId,
      requester_id: currentUser.id,
      buyer_id: reqType?.default_buyer_id || null,
    })

    if (statusId === 's1') {
      toast.success('Rascunho salvo com sucesso!')
    } else {
      toast.success('Solicitação enviada para aprovação!')
    }

    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setDesc('')
    setType('')
    setProjectId('')
    setReqTypeId('')
    setPriority('P2')
    setNeedDate('')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) resetForm()
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Criar Nova Solicitação</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="col-span-2 space-y-2">
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
            <Select value={type} onValueChange={(v: any) => setType(v)}>
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
            <Label>
              Tipo de Solicitação <span className="text-red-500">*</span>
            </Label>
            <Select value={reqTypeId} onValueChange={setReqTypeId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {activeReqTypes.map((rt) => (
                  <SelectItem key={rt.id} value={rt.id}>
                    {rt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Projeto <span className="text-red-500">*</span>
            </Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {activeProjects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Prioridade <span className="text-red-500">*</span>
            </Label>
            <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P0">P0 - Crítica</SelectItem>
                <SelectItem value="P1">P1 - Alta</SelectItem>
                <SelectItem value="P2">P2 - Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Data de Necessidade <span className="text-red-500">*</span>
            </Label>
            <Input type="date" value={needDate} onChange={(e) => setNeedDate(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="pt-2 flex gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="secondary" onClick={() => handleSave('s1')}>
            Salvar Rascunho
          </Button>
          <Button onClick={() => handleSave('s1.5')}>Salvar e Enviar para Aprovação</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
