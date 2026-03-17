import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SYSTEM_FIELDS } from './constants'
import { ERP_ITEM_FIELDS } from '@/constants/erp-fields'
import useAppStore from '@/stores/useAppStore'
import { toast } from 'sonner'

interface MappingStepProps {
  headers: string[]
  rawData: any[]
  mapping: Record<string, string>
  onMappingChange: (mapping: Record<string, string>) => void
  onCancel: () => void
  onConfirm: (groups: any[]) => void
}

const ALL_FIELDS = [...SYSTEM_FIELDS, ...ERP_ITEM_FIELDS]

export function MappingStep({
  headers,
  rawData,
  mapping,
  onMappingChange,
  onCancel,
  onConfirm,
}: MappingStepProps) {
  const { requests, materials } = useAppStore()

  const handleGroup = () => {
    const missing = SYSTEM_FIELDS.filter((f) => f.required && !mapping[f.id])
    if (missing.length > 0) {
      toast.error(`Mapeie os campos obrigatórios: ${missing.map((m) => m.label).join(', ')}`)
      return
    }

    const mapData = new Map<string, any>()

    rawData.forEach((row, index) => {
      const reqNumber = row[mapping['request_number']]
      if (!reqNumber || String(reqNumber).trim() === '') return

      const isDuplicate = requests.some(
        (r: any) =>
          String(r.request_number).trim().toLowerCase() === String(reqNumber).trim().toLowerCase(),
      )

      if (!mapData.has(reqNumber)) {
        mapData.set(reqNumber, {
          request_number: reqNumber,
          description: row[mapping['description']] || '',
          type: row[mapping['type']] || 'Material',
          project_id: row[mapping['project_id']] || null,
          request_type_id: row[mapping['request_type_id']] || null,
          priority: row[mapping['priority']] || 'P2',
          need_date: row[mapping['need_date']] || null,
          delivery_date: row[mapping['delivery_date']] || null,
          status_id: row[mapping['status_id']] || null,
          requester_id: row[mapping['requester_id']] || null,
          buyer_id: row[mapping['buyer_id']] || null,
          board: row[mapping['board']] || null,
          order_number: row[mapping['order_number']] || null,
          isDuplicate,
          accepted: !isDuplicate,
          items: [],
        })
      }

      const matCode = row[mapping['material_id']]
      const qty = row[mapping['quantity']]

      if (matCode && String(matCode).trim() !== '') {
        const mat = materials.find(
          (m: any) => m.custom_code === String(matCode).trim() || m.id === String(matCode).trim(),
        )

        const itemPayload: any = {
          material_id: mat ? mat.id : String(matCode).trim(),
          material_code: mat ? mat.custom_code || mat.id : String(matCode).trim(),
          quantity: Number(qty) || 1,
          accepted: !isDuplicate,
          rowIndex: index + 2,
        }

        ERP_ITEM_FIELDS.forEach((f) => {
          const mappedKey = mapping[f.id]
          if (mappedKey && row[mappedKey] !== undefined && row[mappedKey] !== '') {
            let val = row[mappedKey]
            if (f.type === 'numeric') {
              if (typeof val === 'string') val = Number(val.replace(/\./g, '').replace(',', '.'))
              itemPayload[f.id] = isNaN(val as number) ? 0 : val
            } else {
              itemPayload[f.id] = String(val).trim()
            }
          }
        })

        mapData.get(reqNumber).items.push(itemPayload)
      }
    })

    const parsedGroups = Array.from(mapData.values())
    if (parsedGroups.length === 0) {
      toast.error('Nenhum dado válido encontrado após o agrupamento.')
      return
    }

    onConfirm(parsedGroups)
  }

  return (
    <Card className="flex flex-col max-h-[85vh]">
      <CardHeader className="border-b bg-slate-50/50 shrink-0">
        <CardTitle>Mapeamento de Colunas</CardTitle>
        <CardDescription>
          Vincule as colunas da planilha aos campos do sistema e do ERP.
        </CardDescription>
      </CardHeader>
      <ScrollArea className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
          {ALL_FIELDS.map((f) => (
            <div key={f.id} className="space-y-2">
              <Label className="flex items-center text-sm font-medium text-slate-700">
                {f.label}{' '}
                {'required' in f && f.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Select
                value={mapping[f.id] || ''}
                onValueChange={(v) =>
                  onMappingChange({ ...mapping, [f.id]: v === 'none' ? '' : v })
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-muted-foreground italic">
                    Não mapear
                  </SelectItem>
                  {headers.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-6 border-t bg-slate-50/50 flex justify-end gap-3 shrink-0">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleGroup}>Continuar para Revisão</Button>
      </div>
    </Card>
  )
}
