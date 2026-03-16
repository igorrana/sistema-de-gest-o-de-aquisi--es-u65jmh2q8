import { useState, useEffect } from 'react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import useAppStore from '@/stores/useAppStore'
import useAuthStore from '@/stores/useAuthStore'
import { Material } from '@/types'
import { Trash, Plus, Search } from 'lucide-react'
import { MaterialSelectionModal } from './MaterialSelectionModal'

interface RowItem {
  id: string
  material: Material | null
  quantity: number
}

export function NewRequestModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { addRequest, projects, requestTypes, requests } = useAppStore()
  const { currentUser } = useAuthStore()

  const [reqNumber, setReqNumber] = useState('')
  const [desc, setDesc] = useState('')
  const [projectId, setProjectId] = useState('')
  const [reqTypeId, setReqTypeId] = useState('')
  const [priority, setPriority] = useState<'P0' | 'P1' | 'P2'>('P2')
  const [needDate, setNeedDate] = useState('')
  const [items, setItems] = useState<RowItem[]>([{ id: '1', material: null, quantity: 1 }])
  const [selectingRowId, setSelectingRowId] = useState<string | null>(null)

  const activeProjects = projects.filter((p) => p.is_active)
  const activeReqTypes = requestTypes.filter((rt) => rt.is_active)

  // Generate suggested ID when modal opens
  useEffect(() => {
    if (open) {
      const existingNumbers = requests
        .map((r) => r.request_number)
        .filter(Boolean)
        .map((n) => parseInt(String(n).replace(/\D/g, ''), 10))
        .filter((n) => !isNaN(n))

      const max = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0
      setReqNumber(`REQ-${String(max + 1).padStart(3, '0')}`)
    }
  }, [open]) // Intentionally not including requests to avoid overriding user edits mid-flight

  const handleSave = (statusId: string) => {
    if (!desc || !projectId || !reqTypeId || !priority || !needDate || !currentUser || !reqNumber) {
      return toast.error('Preencha todos os campos obrigatórios do cabeçalho')
    }
    const validItems = items.filter((i) => i.material !== null)
    if (validItems.length === 0) return toast.error('Adicione pelo menos um item na solicitação')

    if (needDate < new Date().toISOString().split('T')[0]) {
      return toast.error('A Data de Necessidade deve ser no futuro')
    }

    const reqType = requestTypes.find((rt) => rt.id === reqTypeId)
    const mainType = validItems[0].material?.type || 'Material'

    addRequest({
      request_number: reqNumber,
      description: desc,
      type: mainType as 'Material' | 'Serviço',
      project_id: projectId,
      request_type_id: reqTypeId,
      priority,
      need_date: needDate,
      status_id: statusId,
      requester_id: currentUser.id,
      buyer_id: reqType?.default_buyer_id || null,
      items: validItems.map((i) => ({
        id: Math.random().toString(36).substring(2, 9),
        material_id: i.material!.id,
        quantity: i.quantity,
      })),
    })

    toast.success(
      statusId === 's1' ? 'Rascunho salvo com sucesso!' : 'Solicitação enviada para aprovação!',
    )
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setReqNumber('')
    setDesc('')
    setProjectId('')
    setReqTypeId('')
    setPriority('P2')
    setNeedDate('')
    setItems([{ id: '1', material: null, quantity: 1 }])
  }

  const addRow = () =>
    setItems([...items, { id: Math.random().toString(), material: null, quantity: 1 }])
  const removeRow = (id: string) =>
    setItems(
      items.length > 1
        ? items.filter((i) => i.id !== id)
        : [{ id: Math.random().toString(), material: null, quantity: 1 }],
    )
  const updateRow = (id: string, updates: Partial<RowItem>) =>
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)))

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          onOpenChange(val)
          if (!val) resetForm()
        }}
      >
        <DialogContent className="max-w-6xl flex flex-col max-h-[90vh] bg-slate-50 p-0 border-0 shadow-2xl overflow-hidden">
          <DialogHeader className="px-6 py-4 bg-white border-b shrink-0">
            <DialogTitle className="text-2xl font-bold text-[#1E40AF]">
              Criar Nova Solicitação
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            <div className="bg-white p-5 rounded-lg border shadow-sm space-y-4">
              <h3 className="font-semibold text-[#1E40AF] border-b pb-2">Informações Gerais</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>
                    ID da Solicitação <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={reqNumber}
                    onChange={(e) => setReqNumber(e.target.value)}
                    placeholder="Ex: REQ-001"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>
                    Descrição Geral <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Ex: Aquisição de materiais..."
                  />
                </div>
                <div className="col-span-2 space-y-2">
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
                <div className="col-span-2 space-y-2">
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
                <div className="col-span-2 space-y-2">
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
                <div className="col-span-2 space-y-2">
                  <Label>
                    Data de Necessidade <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={needDate}
                    onChange={(e) => setNeedDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border shadow-sm space-y-4">
              <h3 className="font-semibold text-[#1E40AF] border-b pb-2">Itens da Solicitação</h3>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-100">
                    <TableRow>
                      <TableHead className="w-[350px]">Material / Serviço</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>NCM</TableHead>
                      <TableHead className="w-[120px]">Qtd</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          {row.material ? (
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className="font-medium text-sm truncate"
                                title={row.material.name}
                              >
                                {row.material.name}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 shrink-0"
                                onClick={() => setSelectingRowId(row.id)}
                              >
                                <Search className="w-4 h-4 text-blue-600" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-muted-foreground bg-slate-50"
                              onClick={() => setSelectingRowId(row.id)}
                            >
                              <Search className="w-4 h-4 mr-2" /> Selecionar Item...
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {row.material?.type || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {row.material?.unit || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {row.material?.ncm || '-'}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            className="h-8 w-24"
                            value={row.quantity || ''}
                            onChange={(e) =>
                              updateRow(row.id, { quantity: Number(e.target.value) })
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => removeRow(row.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-2 border-t bg-slate-50">
                  <Button
                    variant="ghost"
                    onClick={addRow}
                    className="w-full text-[#3B82F6] hover:text-[#1E40AF] hover:bg-blue-50/50 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Adicionar Linha
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 bg-slate-100 border-t shrink-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSave('s1')}
              className="bg-white hover:bg-slate-200 text-slate-800 border shadow-sm"
            >
              Salvar como Rascunho
            </Button>
            <Button
              onClick={() => handleSave('s1.5')}
              className="bg-[#1E40AF] hover:bg-[#1E40AF]/90"
            >
              Salvar e Enviar para Aprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <MaterialSelectionModal
        open={!!selectingRowId}
        onOpenChange={(o) => {
          if (!o) setSelectingRowId(null)
        }}
        onSelect={(m) => {
          if (selectingRowId) updateRow(selectingRowId, { material: m })
        }}
      />
    </>
  )
}
