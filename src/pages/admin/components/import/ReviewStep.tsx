import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { processImport } from './import-utils'
import useAppStore from '@/stores/useAppStore'
import { ItemERPDetails } from '@/components/ItemERPDetails'

interface ReviewStepProps {
  groups: any[]
  setGroups: (updater: any) => void
  onBack: () => void
  onSuccess: () => void
}

export function ReviewStep({ groups, setGroups, onBack, onSuccess }: ReviewStepProps) {
  const [isImporting, setIsImporting] = useState(false)
  const { materials } = useAppStore()

  const toggleGroup = (reqNum: string, accepted: boolean) => {
    setGroups((prev: any) =>
      prev.map((g: any) =>
        g.request_number === reqNum
          ? { ...g, accepted, items: g.items.map((i: any) => ({ ...i, accepted })) }
          : g,
      ),
    )
  }

  const toggleItem = (reqNum: string, rowIndex: number, accepted: boolean) => {
    setGroups((prev: any) =>
      prev.map((g: any) => {
        if (g.request_number === reqNum) {
          const newItems = g.items.map((i: any) =>
            i.rowIndex === rowIndex ? { ...i, accepted } : i,
          )
          return { ...g, items: newItems, accepted: newItems.some((i: any) => i.accepted) }
        }
        return g
      }),
    )
  }

  const handleImport = async () => {
    const groupsToImport = groups.filter((g: any) => g.accepted && !g.isDuplicate)
    if (groupsToImport.length === 0) return toast.error('Nenhuma solicitação válida para importar.')

    setIsImporting(true)
    try {
      const count = await processImport(groupsToImport)
      toast.success(`${count} solicitações importadas com sucesso!`)
      onSuccess()
    } catch (e) {
      toast.error('Ocorreu um erro durante a importação.')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-md border shadow-sm sticky top-0 z-10">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Revisão de Importação</h3>
          <p className="text-sm text-slate-500">Verifique os itens e dados do ERP.</p>
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
            )}
            Confirmar Importação
          </Button>
        </div>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {groups.map((g: any) => (
          <AccordionItem
            key={g.request_number}
            value={g.request_number}
            className={`border rounded-lg bg-white overflow-hidden ${g.isDuplicate ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200'} ${!g.accepted && !g.isDuplicate ? 'opacity-70' : ''}`}
          >
            <div
              className={`px-4 flex items-center justify-between border-b ${g.isDuplicate ? 'bg-red-50' : 'bg-slate-50'}`}
            >
              <AccordionTrigger className="hover:no-underline py-3 flex-1 justify-start gap-4">
                <div className="flex flex-col items-start text-left">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-800">
                      Solicitação: {g.request_number}
                    </h4>
                    {g.isDuplicate && (
                      <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        <AlertCircle className="w-3 h-3 mr-1" /> Já existe
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5 line-clamp-1">{g.description}</p>
                </div>
              </AccordionTrigger>
              {!g.isDuplicate && (
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <Button
                    size="sm"
                    variant={g.accepted ? 'default' : 'outline'}
                    className="h-8 text-xs"
                    onClick={() => toggleGroup(g.request_number, true)}
                  >
                    Aceitar Todos
                  </Button>
                  <Button
                    size="sm"
                    variant={!g.accepted ? 'destructive' : 'outline'}
                    className="h-8 text-xs"
                    onClick={() => toggleGroup(g.request_number, false)}
                  >
                    Recusar Todos
                  </Button>
                </div>
              )}
            </div>
            <AccordionContent className="pt-0 pb-0">
              <Table>
                <TableHeader className="bg-white">
                  <TableRow>
                    <TableHead className="w-[50px] text-center">Incs.</TableHead>
                    <TableHead className="w-[120px]">Cód. Material</TableHead>
                    <TableHead>Material / Serviço</TableHead>
                    <TableHead className="w-[80px] text-right">Qtd.</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {g.items.map((i: any) => {
                    const mat = materials.find(
                      (m: any) => m.id === i.material_id || m.custom_code === i.material_code,
                    )
                    return (
                      <TableRow
                        key={i.rowIndex}
                        className={`${!i.accepted ? 'bg-slate-50/50 text-slate-400' : 'group'}`}
                      >
                        <TableCell className="text-center">
                          <Checkbox
                            checked={i.accepted}
                            onCheckedChange={(v) => toggleItem(g.request_number, i.rowIndex, !!v)}
                            disabled={g.isDuplicate}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{i.material_code}</TableCell>
                        <TableCell>
                          {mat ? (
                            <span>{mat.name}</span>
                          ) : (
                            <span className="text-amber-600 flex items-center text-xs font-medium">
                              <AlertCircle className="w-3 h-3 mr-1" /> Não cadastrado
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">{i.quantity}</TableCell>
                        <TableCell className="text-right pr-4">
                          <ItemERPDetails item={i} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
