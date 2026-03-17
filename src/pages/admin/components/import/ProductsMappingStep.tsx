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
import { PRODUCT_FIELDS } from './constants'
import { toast } from 'sonner'
import { useAI } from '@/contexts/AIContext'

interface Props {
  headers: string[]
  rawData: any[]
  mapping: Record<string, string>
  onMappingChange: (mapping: Record<string, string>) => void
  onCancel: () => void
  onConfirm: (groups: any[]) => void
}

export function ProductsMappingStep({
  headers,
  rawData,
  mapping,
  onMappingChange,
  onCancel,
  onConfirm,
}: Props) {
  const { addMessage } = useAI()

  const handleGroup = () => {
    const missing = PRODUCT_FIELDS.filter((f) => f.required && !mapping[f.id])
    if (missing.length > 0) {
      toast.error(`Mapeie os campos obrigatórios: ${missing.map((m) => m.label).join(', ')}`)
      return
    }

    const products = rawData
      .map((row, index) => {
        const name = row[mapping['name']]
        if (!name || String(name).trim() === '') return null

        return {
          rowIndex: index + 2,
          name: String(name).trim(),
          sku: mapping['sku'] ? String(row[mapping['sku']] || '').trim() : '',
          description: mapping['description']
            ? String(row[mapping['description']] || '').trim()
            : '',
          category: mapping['category'] ? String(row[mapping['category']] || '').trim() : '',
          unit_price: mapping['unit_price'] ? row[mapping['unit_price']] : '',
          accepted: true,
        }
      })
      .filter(Boolean)

    if (products.length === 0) {
      toast.error('Nenhum dado válido encontrado. Certifique-se de que os nomes estão preenchidos.')
      return
    }

    if (products.length >= 10) {
      addMessage({
        role: 'ai',
        content:
          'I noticed you are importing a large list of products; remember you can save your column mapping for future imports.',
      })
    }

    onConfirm(products)
  }

  return (
    <Card>
      <CardHeader className="border-b bg-slate-50/50">
        <CardTitle>Mapeamento de Produtos</CardTitle>
        <CardDescription>Vincule as colunas da planilha aos campos de Produto.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCT_FIELDS.map((f) => (
            <div key={f.id} className="space-y-2">
              <Label className="flex items-center text-sm font-medium">
                {f.label} {f.required && <span className="text-red-500 ml-1">*</span>}
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
        <div className="mt-8 pt-6 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleGroup}>Continuar para Revisão</Button>
        </div>
      </CardContent>
    </Card>
  )
}
