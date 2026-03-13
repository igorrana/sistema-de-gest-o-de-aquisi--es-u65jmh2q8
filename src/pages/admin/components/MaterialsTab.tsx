import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { ScrollArea } from '@/components/ui/scroll-area'

export function MaterialsTab() {
  const { materials } = useAppStore()

  return (
    <div className="space-y-4 h-[calc(100vh-200px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-lg font-medium">Catálogo de Materiais</h3>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" /> Novo Material
        </Button>
      </div>
      <div className="border rounded-md bg-white flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <TableRow>
                <TableHead>Cód. ERP</TableHead>
                <TableHead>Nome / Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Unid</TableHead>
                <TableHead>NCM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.custom_code}</TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-800">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.description}</div>
                  </TableCell>
                  <TableCell>{m.type}</TableCell>
                  <TableCell>{m.unit}</TableCell>
                  <TableCell>{m.ncm}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  )
}
