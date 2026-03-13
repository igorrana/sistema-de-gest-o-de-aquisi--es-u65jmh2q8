import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PurchaseRequest } from '@/types'
import useAppStore from '@/stores/useAppStore'

interface TableViewProps {
  requests: PurchaseRequest[]
  onRowClick: (id: string) => void
}

export function TableView({ requests, onRowClick }: TableViewProps) {
  const { statuses, users } = useAppStore()

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden h-full flex flex-col">
      <div className="overflow-auto flex-1">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Comprador</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhuma solicitação encontrada.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((r) => {
                const status = statuses.find((s) => s.id === r.status_id)
                const buyer = users.find((u) => u.id === r.buyer_id)
                return (
                  <TableRow
                    key={r.id}
                    onClick={() => onRowClick(r.id)}
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <TableCell className="font-medium">{r.request_number || 'S/N'}</TableCell>
                    <TableCell>{r.description}</TableCell>
                    <TableCell>{r.type}</TableCell>
                    <TableCell>
                      {status && (
                        <Badge
                          style={{ backgroundColor: status.color, color: '#fff' }}
                          className="border-none font-normal"
                        >
                          {status.name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {buyer ? (
                        buyer.name
                      ) : (
                        <span className="text-muted-foreground italic">Não atribuído</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(r.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
