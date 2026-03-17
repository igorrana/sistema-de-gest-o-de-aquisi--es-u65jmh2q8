import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertCircle, ArrowLeft, Save, FileSpreadsheet } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import useAppStore from '@/stores/useAppStore'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'

function parseCSV(text: string) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 1) return { headers: [], data: [] }

  const parseLine = (line: string) => {
    const result = []
    let cell = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cell += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(cell)
        cell = ''
      } else {
        cell += char
      }
    }
    result.push(cell)
    return result
  }

  const headers = parseLine(lines[0]).map((h) => h.trim())
  const data = lines.slice(1).map((line) => {
    const values = parseLine(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = values[i]?.trim() || ''
    })
    return row
  })

  return { headers, data }
}

const SYSTEM_FIELDS = [
  { id: 'request_number', label: 'ID da Solicitação', required: true },
  { id: 'description', label: 'Descrição', required: true },
  { id: 'type', label: 'Tipo (Material/Serviço)', required: false },
  { id: 'priority', label: 'Prioridade (P0/P1/P2)', required: false },
  { id: 'material_code', label: 'Cód. Material (Item)', required: true },
  { id: 'quantity', label: 'Quantidade (Item)', required: true },
]

export function ImportTab() {
  const { requests, materials } = useAppStore()
  const [step, setStep] = useState<'upload' | 'mapping' | 'review'>('upload')
  const [headers, setHeaders] = useState<string[]>([])
  const [rawData, setRawData] = useState<any[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [groups, setGroups] = useState<any[]>([])
  const [isImporting, setIsImporting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error(
        'Por favor, faça o upload de um arquivo .csv válido. (Salve sua planilha Excel como CSV)',
      )
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const { headers: parsedHeaders, data } = parseCSV(text)

      if (parsedHeaders.length === 0 || data.length === 0) {
        toast.error('Arquivo vazio ou formato inválido.')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }

      setHeaders(parsedHeaders)
      setRawData(data)

      const autoMap: Record<string, string> = {}
      parsedHeaders.forEach((h) => {
        const lowerH = h.toLowerCase()
        if (lowerH.includes('id') || lowerH.includes('solicita')) autoMap['request_number'] = h
        if (lowerH.includes('descri')) autoMap['description'] = h
        if (lowerH.includes('tipo')) autoMap['type'] = h
        if (lowerH.includes('prioridade')) autoMap['priority'] = h
        if (lowerH.includes('material') || lowerH.includes('cód')) autoMap['material_code'] = h
        if (lowerH.includes('quant') || lowerH.includes('qtd')) autoMap['quantity'] = h
      })
      setMapping(autoMap)
      setStep('mapping')
    }
    reader.readAsText(file, 'utf-8')
  }

  const handleGroup = () => {
    const missing = SYSTEM_FIELDS.filter((f) => f.required && !mapping[f.id])
    if (missing.length > 0) {
      toast.error(`Mapeie os campos obrigatórios: ${missing.map((m) => m.label).join(', ')}`)
      return
    }

    const mapData = new Map<string, any>()

    rawData.forEach((row, index) => {
      const reqNumber = row[mapping['request_number']]
      if (!reqNumber || reqNumber.trim() === '') return

      const isDuplicate = requests.some(
        (r) =>
          String(r.request_number).trim().toLowerCase() === String(reqNumber).trim().toLowerCase(),
      )

      if (!mapData.has(reqNumber)) {
        mapData.set(reqNumber, {
          request_number: reqNumber,
          description: row[mapping['description']] || '',
          type: row[mapping['type']] || 'Material',
          priority: row[mapping['priority']] || 'P2',
          isDuplicate,
          accepted: !isDuplicate,
          items: [],
        })
      }

      const matCode = row[mapping['material_code']]
      const qty = row[mapping['quantity']]

      if (matCode && matCode.trim() !== '') {
        const mat = materials.find((m) => m.custom_code === matCode.trim())
        mapData.get(reqNumber).items.push({
          material_code: matCode.trim(),
          material_id: mat ? mat.id : matCode.trim(),
          quantity: Number(qty) || 1,
          accepted: !isDuplicate,
          rowIndex: index + 2,
        })
      }
    })

    const parsedGroups = Array.from(mapData.values())
    if (parsedGroups.length === 0) {
      toast.error('Nenhum dado válido encontrado após o agrupamento.')
      return
    }

    setGroups(parsedGroups)
    setStep('review')
  }

  const toggleGroup = (reqNumber: string, accepted: boolean) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.request_number === reqNumber) {
          return { ...g, accepted, items: g.items.map((i: any) => ({ ...i, accepted })) }
        }
        return g
      }),
    )
  }

  const toggleItem = (reqNumber: string, rowIndex: number, accepted: boolean) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.request_number === reqNumber) {
          const newItems = g.items.map((i: any) =>
            i.rowIndex === rowIndex ? { ...i, accepted } : i,
          )
          const anyAccepted = newItems.some((i: any) => i.accepted)
          return { ...g, items: newItems, accepted: anyAccepted }
        }
        return g
      }),
    )
  }

  const handleImport = async () => {
    const groupsToImport = groups.filter((g) => g.accepted && !g.isDuplicate)
    if (groupsToImport.length === 0) {
      toast.error('Nenhuma solicitação válida e aceita para importar.')
      return
    }

    setIsImporting(true)
    let importedCount = 0

    try {
      for (const g of groupsToImport) {
        const itemsToImport = g.items.filter((i: any) => i.accepted)
        if (itemsToImport.length === 0) continue

        const { data: reqData, error: reqError } = await supabase
          .from('purchase_requests')
          .insert({
            request_number: g.request_number,
            description: g.description,
            type: g.type,
            priority: g.priority,
            status_id: 's1',
          })
          .select('id')
          .single()

        if (reqError || !reqData) {
          console.error(reqError)
          toast.error(`Erro ao salvar solicitação ${g.request_number}`)
          continue
        }

        const itemsPayload = itemsToImport.map((i: any) => ({
          purchase_request_id: reqData.id,
          material_id: i.material_id,
          quantity: i.quantity,
        }))

        if (itemsPayload.length > 0) {
          await supabase.from('purchase_request_items').insert(itemsPayload)
        }

        importedCount++

        try {
          ;(useAppStore as any).setState((state: any) => ({
            requests: [
              ...state.requests,
              {
                id: reqData.id,
                request_number: g.request_number,
                description: g.description,
                type: g.type,
                priority: g.priority,
                status_id: 's1',
                created_at: new Date().toISOString(),
                items: itemsPayload.map((p: any) => ({
                  id: Math.random().toString(),
                  material_id: p.material_id,
                  quantity: p.quantity,
                })),
              },
            ],
          }))
        } catch (e) {
          // Fallback if local store update fails
        }
      }

      toast.success(`${importedCount} solicitações importadas com sucesso!`)
      setStep('upload')
      setGroups([])
      setMapping({})
      setRawData([])
      setHeaders([])
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      console.error(error)
      toast.error('Ocorreu um erro durante a importação.')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {step === 'upload' && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Importar planilha (CSV)</h3>
            <p className="text-sm text-muted-foreground mb-8 max-w-md">
              Selecione um arquivo .csv contendo as solicitações. O sistema identificará
              automaticamente solicitações com múltiplos itens através do ID da Solicitação.
            </p>
            <div className="flex gap-4 items-center">
              <Input
                type="file"
                accept=".csv"
                className="max-w-xs cursor-pointer"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'mapping' && (
        <Card>
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle>Mapeamento de Colunas</CardTitle>
            <CardDescription>
              Vincule as colunas da sua planilha aos campos do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {SYSTEM_FIELDS.map((f) => (
                <div key={f.id} className="space-y-2">
                  <Label className="flex items-center text-sm font-medium">
                    {f.label}
                    {f.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Select
                    value={mapping[f.id] || ''}
                    onValueChange={(v) => setMapping({ ...mapping, [f.id]: v === 'none' ? '' : v })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione a coluna..." />
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
              <Button
                variant="outline"
                onClick={() => {
                  setStep('upload')
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleGroup}>Continuar para Revisão</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'review' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-md border shadow-sm sticky top-0 z-10">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Revisão de Importação</h3>
              <p className="text-sm text-slate-500">
                Verifique e confirme os itens que serão importados.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('mapping')} disabled={isImporting}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Mapeamento
              </Button>
              <Button
                onClick={handleImport}
                disabled={isImporting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isImporting ? 'Importando...' : 'Confirmar Importação'}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {groups.map((g) => (
              <Card
                key={g.request_number}
                className={`overflow-hidden transition-all ${g.isDuplicate ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200'} ${!g.accepted && !g.isDuplicate ? 'opacity-70' : ''}`}
              >
                <div
                  className={`px-4 py-3 border-b flex justify-between items-center ${g.isDuplicate ? 'bg-red-50' : 'bg-slate-50'}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-800">
                        Solicitação: {g.request_number}
                      </h4>
                      {g.isDuplicate && (
                        <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                          <AlertCircle className="w-3 h-3 mr-1" /> Já existe no sistema
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">{g.description}</p>
                  </div>

                  {!g.isDuplicate && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={g.accepted ? 'default' : 'outline'}
                        className="h-8 text-xs"
                        onClick={() => toggleGroup(g.request_number, true)}
                      >
                        Aceitar Grupo
                      </Button>
                      <Button
                        size="sm"
                        variant={!g.accepted ? 'destructive' : 'outline'}
                        className="h-8 text-xs"
                        onClick={() => toggleGroup(g.request_number, false)}
                      >
                        Rejeitar Grupo
                      </Button>
                    </div>
                  )}
                </div>

                <Table>
                  <TableHeader className="bg-white">
                    <TableRow>
                      <TableHead className="w-[50px] text-center">Incs.</TableHead>
                      <TableHead className="w-[150px]">Cód. Material</TableHead>
                      <TableHead>Material / Serviço</TableHead>
                      <TableHead className="w-[100px] text-right">Qtd.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {g.items.map((i: any) => {
                      const mat = materials.find((m: any) => m.custom_code === i.material_code)
                      return (
                        <TableRow
                          key={i.rowIndex}
                          className={`${!i.accepted ? 'bg-slate-50/50 text-slate-400' : ''}`}
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
                                <AlertCircle className="w-3 h-3 mr-1" /> Item não cadastrado
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">{i.quantity}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
