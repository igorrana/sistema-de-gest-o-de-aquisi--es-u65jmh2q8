import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react'

export function ImportTab() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])

  const handleSimulate = () => {
    if (!file) return
    setPreview([
      { line: 2, field: 'request_number', status: 'OK', reason: '' },
      { line: 3, field: 'description', status: 'Error', reason: 'Descrição não pode ser vazia' },
      { line: 4, field: 'status_id', status: 'Error', reason: 'Status inválido (s99)' },
    ])
  }

  return (
    <div className="space-y-6">
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center p-10 text-center">
          <UploadCloud className="h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Importar planilha (.xlsx)</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Arraste um arquivo ou clique para selecionar. O arquivo deve seguir o template padrão de
            importação.
          </p>
          <div className="flex gap-4 items-center">
            <Input
              type="file"
              accept=".xlsx"
              className="max-w-xs"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button onClick={handleSimulate} disabled={!file}>
              Simular
            </Button>
          </div>
        </CardContent>
      </Card>

      {preview.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-20">Linha</TableHead>
                  <TableHead>Campo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Motivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.map((p, i) => (
                  <TableRow key={i} className={p.status === 'Error' ? 'bg-red-50/50' : ''}>
                    <TableCell className="font-medium">{p.line}</TableCell>
                    <TableCell>{p.field}</TableCell>
                    <TableCell>
                      {p.status === 'OK' ? (
                        <CheckCircle2 className="text-green-500 h-5 w-5" />
                      ) : (
                        <AlertCircle className="text-red-500 h-5 w-5" />
                      )}
                    </TableCell>
                    <TableCell className="text-red-600 font-medium text-sm">{p.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
