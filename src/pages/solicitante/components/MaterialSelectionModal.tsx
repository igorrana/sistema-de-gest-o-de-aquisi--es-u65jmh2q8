import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import useAppStore from '@/stores/useAppStore'
import { Material } from '@/types'
import { Search, Plus } from 'lucide-react'

export function MaterialSelectionModal({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onSelect: (m: Material) => void
}) {
  const { materials, addMaterial } = useAppStore()
  const [search, setSearch] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'Material' | 'Serviço'>('Material')
  const [unit, setUnit] = useState('')
  const [ncm, setNcm] = useState('')

  const filtered = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()),
  )

  const resetForm = () => {
    setName('')
    setDescription('')
    setType('Material')
    setUnit('')
    setNcm('')
  }

  const handleCreate = () => {
    if (!name || !description || !type || !unit || !ncm) return
    const newMat = addMaterial({ name, description, type, unit, ncm })
    onSelect(newMat)
    onOpenChange(false)
    setIsCreating(false)
    resetForm()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) {
          setIsCreating(false)
          resetForm()
        }
      }}
    >
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl text-[#1E40AF]">
            {isCreating ? 'Cadastrar Novo Item' : 'Selecionar Material / Serviço'}
          </DialogTitle>
        </DialogHeader>

        {isCreating ? (
          <div className="flex flex-col gap-5 py-2 overflow-y-auto">
            <div className="space-y-2">
              <Label>
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Motor Elétrico 5CV..."
              />
            </div>
            <div className="space-y-2">
              <Label>
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalhes técnicos..."
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>
                  Tipo <span className="text-red-500">*</span>
                </Label>
                <Select value={type} onValueChange={(v: any) => setType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Material">Material</SelectItem>
                    <SelectItem value="Serviço">Serviço</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  Unidade <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Ex: un, kg, m"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  NCM <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={ncm}
                  onChange={(e) => setNcm(e.target.value)}
                  placeholder="Ex: 8501.52.10"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} className="bg-[#3B82F6] hover:bg-[#1E40AF]">
                Salvar e Selecionar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Buscar por nome ou descrição..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 shrink-0"
              >
                <Plus className="w-4 h-4 mr-2" /> Cadastrar Novo Item
              </Button>
            </div>
            <div className="border rounded-md flex-1 overflow-hidden flex flex-col min-h-[300px] shadow-sm">
              <ScrollArea className="flex-1">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>NCM</TableHead>
                      <TableHead className="w-[110px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Nenhum item encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((m) => (
                        <TableRow key={m.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-mono text-xs text-slate-500">
                            {m.system_code || m.custom_code || m.id}
                          </TableCell>
                          <TableCell className="font-medium text-slate-800">{m.name}</TableCell>
                          <TableCell className="text-slate-600">{m.type}</TableCell>
                          <TableCell className="text-slate-600">{m.unit}</TableCell>
                          <TableCell className="text-slate-600">{m.ncm}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[#3B82F6] border-[#3B82F6] hover:bg-blue-50"
                              onClick={() => {
                                onSelect(m)
                                onOpenChange(false)
                              }}
                            >
                              Selecionar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
