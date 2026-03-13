import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'

export function RequestTypesTab() {
  const { requestTypes, users } = useAppStore()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tipos de Solicitação</h3>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" /> Novo Tipo
        </Button>
      </div>
      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Comprador Padrão</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requestTypes.map((rt) => {
              const buyer = users.find((u) => u.id === rt.default_buyer_id)
              return (
                <TableRow key={rt.id}>
                  <TableCell className="font-medium">{rt.name}</TableCell>
                  <TableCell>
                    {buyer?.name || <span className="text-muted-foreground italic">Nenhum</span>}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={rt.is_active ? 'default' : 'secondary'}
                      className={rt.is_active ? 'bg-emerald-500' : ''}
                    >
                      {rt.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
