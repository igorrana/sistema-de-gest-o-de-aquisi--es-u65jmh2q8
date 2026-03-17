import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { processProductsImport } from './import-utils'

interface Props {
  groups: any[]
  setGroups: (updater: any) => void
  onBack: () => void
  onSuccess: () => void
}

export function ProductsReviewStep({ groups, setGroups, onBack, onSuccess }: Props) {
  const [isImporting, setIsImporting] = useState(false)

  const toggleItem = (rowIndex: number, accepted: boolean) => {
    setGroups((prev: any) =>
      prev.map((p: any) => (p.rowIndex === rowIndex ? { ...p, accepted } : p)),
    )
  }

  const toggleAll = (accepted: boolean) => {
    setGroups((prev: any) => prev.map((p: any) => ({ ...p, accepted })))
  }

  const allAccepted = groups.length > 0 && groups.every((p) => p.accepted)

  const handleImport = async () => {
    const toImport = groups.filter((g: any) => g.accepted)
    if (toImport.length === 0) return toast.error('Nenhum produto selecionado.')

    setIsImporting(true)
    try {
      const count = await processProductsImport(toImport)
      toast.success(`${count} produtos importados com sucesso!`)
      onSuccess()
    } catch (e) {
      toast.error('Erro na importação. Verifique SKUs duplicados ou dados inválidos.')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-md border shadow-sm sticky top-0 z-10">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Revisão de Produtos</h3>
          <p className="text-sm text-slate-500">Selecione os produtos que deseja importar.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} disabled={isImporting}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Mapeamento
          </Button>
          <Button
            onClick={handleImport}
            disabled={isImporting}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isImporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}{' '}
            Confirmar Importação
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[50px] text-center">
                <Checkbox checked={allAccepted} onCheckedChange={(v) => toggleAll(!!v)} />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((p) => (
              <TableRow key={p.rowIndex} className={!p.accepted ? 'opacity-50' : ''}>
                <TableCell className="text-center">
                  <Checkbox
                    checked={p.accepted}
                    onCheckedChange={(v) => toggleItem(p.rowIndex, !!v)}
                  />
                </TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.sku}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.unit_price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
