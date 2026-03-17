import React, { useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FileSpreadsheet, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { parseCSV, parseExcelFile } from '@/lib/file-parser'
import { REQUEST_FIELDS, PRODUCT_FIELDS } from './constants'

interface UploadStepProps {
  importType?: 'requests' | 'products'
  onUploadSuccess: (headers: string[], data: any[], mapping: Record<string, string>) => void
}

export function UploadStep({ importType = 'requests', onUploadSuccess }: UploadStepProps) {
  const [isParsing, setIsParsing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const name = file.name.toLowerCase()
    const isCSV = name.endsWith('.csv')
    const isExcel = name.endsWith('.xlsx') || name.endsWith('.xls')

    if (!isCSV && !isExcel) {
      toast.error('Upload apenas de .csv, .xlsx ou .xls.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setIsParsing(true)
    try {
      let parsedHeaders: string[] = []
      let parsedData: any[] = []

      if (isCSV) {
        const text = await file.text()
        const result = parseCSV(text)
        parsedHeaders = result.headers
        parsedData = result.data
      } else {
        const result = await parseExcelFile(file)
        parsedHeaders = result.headers
        parsedData = result.data
      }

      if (parsedHeaders.length === 0 || parsedData.length === 0) {
        toast.error('Arquivo vazio ou formato inválido.')
        return
      }

      const autoMap: Record<string, string> = {}
      const fields = importType === 'requests' ? REQUEST_FIELDS : PRODUCT_FIELDS

      parsedHeaders.forEach((h) => {
        const lowerH = h.toLowerCase()
        fields.forEach((sf) => {
          const lowerL = sf.label.toLowerCase()
          if (
            lowerH.includes(sf.id.replace('_', ' ')) ||
            lowerL.includes(lowerH) ||
            lowerH.includes(lowerL.split(' ')[0])
          ) {
            if (!autoMap[sf.id]) autoMap[sf.id] = h
          }
        })

        if (importType === 'requests') {
          if (lowerH.includes('id') || lowerH.includes('solicita')) autoMap['request_number'] = h
          if (lowerH.includes('descri')) autoMap['description'] = h
          if (lowerH.includes('material') || lowerH.includes('cód')) autoMap['material_id'] = h
          if (lowerH.includes('quant') || lowerH.includes('qtd')) autoMap['quantity'] = h
        } else {
          if (lowerH.includes('nome') || lowerH.includes('name') || lowerH.includes('produto'))
            autoMap['name'] = h
          if (lowerH.includes('sku') || lowerH.includes('código')) autoMap['sku'] = h
          if (lowerH.includes('preço') || lowerH.includes('valor')) autoMap['unit_price'] = h
        }
      })

      onUploadSuccess(parsedHeaders, parsedData, autoMap)
    } catch (error) {
      toast.error('Erro ao ler o arquivo.')
    } finally {
      setIsParsing(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          {isParsing ? (
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          ) : (
            <FileSpreadsheet className="h-8 w-8 text-primary" />
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2">Importar planilha (Excel ou CSV)</h3>
        <p className="text-sm text-muted-foreground mb-8 max-w-md">
          {importType === 'requests'
            ? 'Selecione um arquivo .xlsx, .xls ou .csv contendo as solicitações. O sistema identificará automaticamente solicitações com múltiplos itens.'
            : 'Selecione um arquivo .xlsx, .xls ou .csv contendo os dados dos produtos para cadastro em lote.'}
        </p>
        <Input
          type="file"
          accept=".csv,.xlsx,.xls"
          className="max-w-xs cursor-pointer"
          onChange={handleFileUpload}
          ref={fileInputRef}
          disabled={isParsing}
        />
      </CardContent>
    </Card>
  )
}
